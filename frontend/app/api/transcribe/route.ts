import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import os from 'os';
import Groq from 'groq-sdk';

export const config = {
  api: {
    bodyParser: false,
  },
};

// This function converts a ReadableStream to a Buffer
async function streamToBuffer(stream: ReadableStream): Promise<Buffer> {
  const reader = stream.getReader();
  const chunks: Uint8Array[] = [];
  
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value);
  }
  
  return Buffer.concat(chunks);
}

export async function POST(request: Request) {
  try {
    // Check if the request is multipart/form-data
    const contentType = request.headers.get('content-type');
    if (!contentType || !contentType.includes('multipart/form-data')) {
      return new NextResponse(JSON.stringify({ error: 'Content-Type must be multipart/form-data' }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' } 
      });
    }

    // Get form data from the request
    const formData = await request.formData();
    const audioFile = formData.get('file');

    if (!audioFile || !(audioFile instanceof File)) {
      return new NextResponse(JSON.stringify({ error: 'No audio file provided' }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' } 
      });
    }

    // Save file to temp directory
    const tempDir = os.tmpdir();
    const tempFilePath = path.join(tempDir, `audio-${Date.now()}.webm`);
    
    // Convert file to buffer and save to temp file
    const arrayBuffer = await audioFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    fs.writeFileSync(tempFilePath, buffer);

    // Initialize Groq client (make sure to set GROQ_API_KEY environment variable)
    const groq = new Groq();
    
    try {
      // Perform transcription
      const transcription = await groq.audio.transcriptions.create({
        file: fs.createReadStream(tempFilePath),
        model: "whisper-large-v3-turbo",
        response_format: "verbose_json",
      });
      
      // Delete temporary file
      fs.unlinkSync(tempFilePath);
      
      // Return transcription text
      return new NextResponse(JSON.stringify({ 
        text: transcription.text,
        success: true 
      }), { 
        status: 200,
        headers: { 'Content-Type': 'application/json' } 
      });
      
    } catch (error) {
      console.error('Groq API error:', error);
      
      // Delete temporary file
      try {
        fs.unlinkSync(tempFilePath);
      } catch (e) {
        console.error('Error deleting temp file:', e);
      }
      
      return new NextResponse(JSON.stringify({ 
        error: 'Failed to transcribe audio',
        details: error instanceof Error ? error.message : String(error)
      }), { 
        status: 500,
        headers: { 'Content-Type': 'application/json' } 
      });
    }
    
  } catch (error) {
    console.error('Server error:', error);
    return new NextResponse(JSON.stringify({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : String(error)
    }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' } 
    });
  }
} 