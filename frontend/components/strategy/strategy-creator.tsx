"use client";

import { motion } from "framer-motion";
import { Editor } from "@monaco-editor/react";
import { useState } from "react";
import { 
  Code, 
  CloudUpload, 
  Rocket, 
  CheckCircle, 
  AlertCircle, 
  Copy,
  Download,
  Play,
  Loader2
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";

interface StrategyCreatorProps {
  strategyData?: {
    title: string;
    description: string;
    riskLevel: 'Low' | 'Medium' | 'High';
    pythonCode: string;
    estimatedGas?: number;
    complexity?: 'Beginner' | 'Intermediate' | 'Advanced';
  };
}

export function StrategyCreator({ strategyData }: StrategyCreatorProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [creationStatus, setCreationStatus] = useState<'idle' | 'creating' | 'success' | 'error'>('idle');
  const [code, setCode] = useState(strategyData?.pythonCode || '');
  const [createdAgentId, setCreatedAgentId] = useState<string | null>(null);
  const [isDeploying, setIsDeploying] = useState(false);
  const [deployStatus, setDeployStatus] = useState<'idle' | 'deploying' | 'deployed' | 'error'>('idle');

  // Show loading skeleton if no data provided
  if (!strategyData) {
    return (
      <div className="w-full max-w-4xl mx-auto">
        <Card className="animate-pulse bg-card border">
          <CardHeader>
            <div className="h-6 w-48 bg-muted rounded mb-2"></div>
            <div className="h-4 w-full bg-muted rounded"></div>
          </CardHeader>
          <CardContent>
            <div className="h-64 bg-muted rounded mb-4"></div>
            <div className="h-10 w-32 bg-muted rounded"></div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { title, description, riskLevel, pythonCode, estimatedGas, complexity } = strategyData;

  const handleCreateAgent = async () => {
    setIsCreating(true);
    setCreationStatus('creating');
    
    try {
      // Create agent via FastAPI backend
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const response = await fetch(`${apiUrl}/agents/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code: code,
          creator: "Entropy User", // You can get this from user context later
          title: title,
          summary: description,
          description: `Risk Level: ${riskLevel}, Complexity: ${complexity}. ${description}`,
          type: "strategy", // Set as strategy type
        }),
      });

      if (response.ok) {
        const result = await response.json();
        setCreationStatus('success');
        setCreatedAgentId(result.agent_id);
        toast.success(`Agent created successfully! Agent ID: ${result.agent_id}`);
        console.log('Agent created:', result);
      } else {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
        throw new Error(errorData.message || 'Agent creation failed');
      }
    } catch (error) {
      setCreationStatus('error');
      let errorMessage = 'Unknown error occurred';
      
      if (error instanceof Error) {
        if (error.message.includes('fetch')) {
          errorMessage = 'Cannot connect to backend. Please ensure the FastAPI server is running on port 8000.';
        } else {
          errorMessage = error.message;
        }
      }
      
      toast.error(`Failed to create agent: ${errorMessage}`);
      console.error('Agent creation error:', error);
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeployStrategy = async () => {
    if (!createdAgentId) {
      toast.error('Please create the agent first');
      return;
    }

    setIsDeploying(true);
    setDeployStatus('deploying');
    
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const response = await fetch(`${apiUrl}/agents/deploy`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          agent_id: createdAgentId,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        setDeployStatus('deployed');
        toast.success(`Strategy deployed successfully! ${result.status}`);
        console.log('Agent deployed:', result);
      } else {
        const errorData = await response.json().catch(() => ({ detail: 'Unknown error' }));
        throw new Error(errorData.detail || 'Failed to deploy agent');
      }
    } catch (error) {
      setDeployStatus('error');
      let errorMessage = 'Unknown error occurred';
      
      if (error instanceof Error) {
        if (error.message.includes('fetch')) {
          errorMessage = 'Cannot connect to backend. Please ensure the FastAPI server is running on port 8000.';
        } else {
          errorMessage = error.message;
        }
      }
      
      toast.error(`Failed to deploy strategy: ${errorMessage}`);
      console.error('Deploy strategy error:', error);
    } finally {
      setIsDeploying(false);
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(code);
    toast.success('Code copied to clipboard!');
  };

  const handleDownloadCode = () => {
    const blob = new Blob([code], { type: 'text/python' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title.toLowerCase().replace(/\s+/g, '_')}_strategy.py`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Strategy downloaded!');
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'Low': return 'bg-secondary text-secondary-foreground';
      case 'Medium': return 'bg-secondary text-secondary-foreground';
      case 'High': return 'bg-secondary text-secondary-foreground';
      default: return 'bg-secondary text-secondary-foreground';
    }
  };

  const getComplexityColor = (comp: string) => {
    return 'bg-secondary text-secondary-foreground';
  };

  return (
    <motion.div 
      className="w-full max-w-4xl mx-auto"
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="shadow-lg border bg-card">
        {/* Header */}
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-2xl font-bold text-foreground">
                <Code className="inline mr-2 h-6 w-6 text-muted-foreground" />
                {title}
              </CardTitle>
              <CardDescription className="text-base mt-2">
                {description}
              </CardDescription>
            </div>
          </div>

          {/* Badges */}
          <div className="flex flex-wrap gap-2 mt-4">
            <Badge variant="outline" className={getRiskColor(riskLevel)}>
              Risk: {riskLevel}
            </Badge>
            {complexity && (
              <Badge variant="outline" className={getComplexityColor(complexity)}>
                Complexity: {complexity}
              </Badge>
            )}
            {estimatedGas && (
              <Badge variant="outline" className="bg-secondary text-secondary-foreground">
                Est. Gas: {estimatedGas.toLocaleString()} units
              </Badge>
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Code Editor Section */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-foreground">
                Strategy Implementation
              </h3>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopyCode}
                  className="text-xs"
                >
                  <Copy className="h-3 w-3 mr-1" />
                  Copy
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDownloadCode}
                  className="text-xs"
                >
                  <Download className="h-3 w-3 mr-1" />
                  Download
                </Button>
              </div>
            </div>
            
            <div className="border border-border rounded-lg overflow-hidden shadow-sm">
              <Editor
                height="300px"
                defaultLanguage="python"
                value={code}
                onChange={(value) => setCode(value || '')}
                theme="vs-dark"
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  lineNumbers: 'on',
                  roundedSelection: false,
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                  wordWrap: 'on',
                  padding: { top: 16, bottom: 16 },
                }}
              />
            </div>
          </div>

          <Separator />

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Deploy Strategy Button */}
            <Button
              onClick={handleDeployStrategy}
              variant="default"
              className="flex-1 h-12 text-sm font-medium"
              disabled={isCreating || !code.trim() || creationStatus !== 'success' || isDeploying || deployStatus === 'deployed'}
            >
              {isDeploying ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Deploying...
                </>
              ) : deployStatus === 'deployed' ? (
                <>
                  <div className="h-2 w-2 mr-2 bg-green-500 rounded-full animate-pulse"></div>
                  Deployed
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-2" />
                  Deploy Strategy
                </>
              )}
            </Button>

            {/* Create Agent Button */}
            <Button
              onClick={handleCreateAgent}
              disabled={isCreating || !code.trim() || creationStatus === 'success'}
              className="flex-1 h-12 text-sm font-medium"
              variant={creationStatus === 'success' ? 'secondary' : creationStatus === 'error' ? 'destructive' : 'secondary'}
            >
              {creationStatus === 'creating' && (
                <>
                  <motion.div
                    className="h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                  Creating Agent...
                </>
              )}
              {creationStatus === 'success' && (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Agent Created!
                </>
              )}
              {creationStatus === 'error' && (
                <>
                  <AlertCircle className="h-4 w-4 mr-2" />
                  Creation Failed
                </>
              )}
              {creationStatus === 'idle' && (
                <>
                  <Rocket className="h-4 w-4 mr-2" />
                  Create Agent
                </>
              )}
            </Button>
          </div>

          {/* Agent Creation Success Message */}
          {creationStatus === 'success' && (
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="p-4 bg-secondary border border-border rounded-lg"
            >
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-primary mr-3" />
                <div>
                  <p className="text-sm font-medium text-foreground">
                    Agent Created Successfully!
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Your trading agent is now created and ready to deploy.
                  </p>
                  {createdAgentId && (
                    <p className="text-xs text-muted-foreground mt-1 font-mono">
                      Agent ID: <span className="text-primary font-medium">{createdAgentId}</span>
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* Deploy Strategy Status Messages */}
          {deployStatus === 'deployed' && (
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="p-4 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg"
            >
              <div className="flex items-center">
                <div className="h-2 w-2 bg-blue-500 rounded-full animate-pulse mr-3"></div>
                <div>
                  <p className="text-sm font-medium text-blue-800 dark:text-blue-200">
                    Strategy Deployed
                  </p>
                  <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                    Your trading strategy is now live and actively executing.
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {deployStatus === 'error' && (
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="p-4 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg"
            >
              <div className="flex items-center">
                <AlertCircle className="h-5 w-5 text-red-500 mr-3" />
                <div>
                  <p className="text-sm font-medium text-red-800 dark:text-red-200">
                    Failed to Deploy Strategy
                  </p>
                  <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                    Please check your backend connection and try again.
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
