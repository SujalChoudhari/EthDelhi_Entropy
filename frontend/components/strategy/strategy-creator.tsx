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
  Play
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
  const [isDeploying, setIsDeploying] = useState(false);
  const [deploymentStatus, setDeploymentStatus] = useState<'idle' | 'deploying' | 'success' | 'error'>('idle');
  const [code, setCode] = useState(strategyData?.pythonCode || '');
  const [deployedAgentId, setDeployedAgentId] = useState<string | null>(null);

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

  const handleDeploy = async () => {
    setIsDeploying(true);
    setDeploymentStatus('deploying');
    
    try {
      // Deploy to your FastAPI backend
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
          monthlyFee: estimatedGas ? estimatedGas / 100000 : 0.1, // Convert gas to fee estimate
        }),
      });

      if (response.ok) {
        const result = await response.json();
        setDeploymentStatus('success');
        setDeployedAgentId(result.agent_id);
        toast.success(`Strategy deployed successfully! Agent ID: ${result.agent_id}`);
        console.log('Agent deployed:', result);
      } else {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
        throw new Error(errorData.message || 'Deployment failed');
      }
    } catch (error) {
      setDeploymentStatus('error');
      let errorMessage = 'Unknown error occurred';
      
      if (error instanceof Error) {
        if (error.message.includes('fetch')) {
          errorMessage = 'Cannot connect to backend. Please ensure the FastAPI server is running on port 8000.';
        } else {
          errorMessage = error.message;
        }
      }
      
      toast.error(`Failed to deploy strategy: ${errorMessage}`);
      console.error('Deployment error:', error);
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
            {/* Test Button */}
            <Button
              variant="outline"
              className="flex-1 h-12 text-sm font-medium"
              disabled={isDeploying || !code.trim()}
            >
              <Play className="h-4 w-4 mr-2" />
              Test Strategy
            </Button>

            {/* Deploy Button */}
            <Button
              onClick={handleDeploy}
              disabled={isDeploying || !code.trim() || deploymentStatus === 'success'}
              className="flex-1 h-12 text-sm font-medium"
              variant={deploymentStatus === 'success' ? 'default' : deploymentStatus === 'error' ? 'destructive' : 'default'}
            >
              {deploymentStatus === 'deploying' && (
                <>
                  <motion.div
                    className="h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                  Deploying...
                </>
              )}
              {deploymentStatus === 'success' && (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Deployed Successfully!
                </>
              )}
              {deploymentStatus === 'error' && (
                <>
                  <AlertCircle className="h-4 w-4 mr-2" />
                  Deployment Failed
                </>
              )}
              {deploymentStatus === 'idle' && (
                <>
                  <Rocket className="h-4 w-4 mr-2" />
                  Deploy Strategy
                </>
              )}
            </Button>
          </div>

          {/* Success Message */}
          {deploymentStatus === 'success' && (
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="p-4 bg-secondary border border-border rounded-lg"
            >
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-primary mr-3" />
                <div>
                  <p className="text-sm font-medium text-foreground">
                    Strategy Deployed Successfully!
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Your trading strategy is now live on the Entropy Engine marketplace.
                  </p>
                  {deployedAgentId && (
                    <p className="text-xs text-muted-foreground mt-1 font-mono">
                      Agent ID: <span className="text-primary font-medium">{deployedAgentId}</span>
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
