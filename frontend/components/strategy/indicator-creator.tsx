"use client";

import { motion } from "framer-motion";
import { Editor } from "@monaco-editor/react";
import { useState } from "react";
import { 
  TrendingUp, 
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

interface IndicatorCreatorProps {
  indicatorData?: {
    title: string;
    description: string;
    indicatorType: 'Trend' | 'Momentum' | 'Volume' | 'Volatility';
    pythonCode: string;
    complexity?: 'Beginner' | 'Intermediate' | 'Advanced';
    outputDescription?: string;
    keyFeatures?: string[];
    dependencies?: string[];
  };
}

export function IndicatorCreator({ indicatorData }: IndicatorCreatorProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [creationStatus, setCreationStatus] = useState<'idle' | 'creating' | 'success' | 'error'>('idle');
  const [code, setCode] = useState(indicatorData?.pythonCode || '');
  const [createdAgentId, setCreatedAgentId] = useState<string | null>(null);
  const [isDeploying, setIsDeploying] = useState(false);
  const [deployStatus, setDeployStatus] = useState<'idle' | 'deploying' | 'deployed' | 'error'>('idle');

  // Show loading skeleton if no data provided
  if (!indicatorData) {
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

  const { 
    title, 
    description, 
    indicatorType, 
    pythonCode, 
    complexity, 
    outputDescription,
    keyFeatures = [],
    dependencies = []
  } = indicatorData;

  const handleCreateAgent = async () => {
    setIsCreating(true);
    setCreationStatus('creating');
    
    try {
      // Create indicator agent via FastAPI backend
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
          description: `Type: ${indicatorType}, Complexity: ${complexity}. ${description}`,
          type: "indicator", // Set as indicator type
          // Note: indicators don't have function_agent_mapping as they don't depend on other agents
        }),
      });

      if (response.ok) {
        const result = await response.json();
        setCreationStatus('success');
        setCreatedAgentId(result.agent_id);
        toast.success(`Indicator created successfully! Agent ID: ${result.agent_id}`);
        console.log('Indicator created:', result);
      } else {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
        throw new Error(errorData.message || 'Indicator creation failed');
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
      
      toast.error(`Failed to create indicator: ${errorMessage}`);
      console.error('Indicator creation error:', error);
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeployIndicator = async () => {
    if (!createdAgentId) {
      toast.error('Please create the indicator first');
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
        toast.success(`Indicator deployed successfully! ${result.status}`);
        console.log('Indicator deployed:', result);
      } else {
        const errorData = await response.json().catch(() => ({ detail: 'Unknown error' }));
        throw new Error(errorData.detail || 'Failed to deploy indicator');
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
      
      toast.error(`Failed to deploy indicator: ${errorMessage}`);
      console.error('Deploy indicator error:', error);
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
    a.download = `${title.toLowerCase().replace(/\s+/g, '_')}_indicator.py`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Indicator downloaded!');
  };

  const getIndicatorTypeColor = (type: string) => {
    switch (type) {
      case 'Trend': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'Momentum': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'Volume': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'Volatility': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
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
                <TrendingUp className="inline mr-2 h-6 w-6 text-muted-foreground" />
                {title}
              </CardTitle>
              <CardDescription className="text-base mt-2">
                {description}
              </CardDescription>
              {outputDescription && (
                <CardDescription className="text-sm mt-1 text-muted-foreground">
                  Output: {outputDescription}
                </CardDescription>
              )}
            </div>
          </div>

          {/* Badges */}
          <div className="flex flex-wrap gap-2 mt-4">
            <Badge variant="outline" className={getIndicatorTypeColor(indicatorType)}>
              {indicatorType} Indicator
            </Badge>
            {complexity && (
              <Badge variant="outline" className={getComplexityColor(complexity)}>
                Complexity: {complexity}
              </Badge>
            )}
            {dependencies.length > 0 && (
              <Badge variant="outline" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                Depends on: {dependencies.length} indicator{dependencies.length > 1 ? 's' : ''}
              </Badge>
            )}
          </div>

          {/* Key Features */}
          {keyFeatures.length > 0 && (
            <div className="mt-4">
              <h4 className="text-sm font-medium text-foreground mb-2">Key Features:</h4>
              <div className="flex flex-wrap gap-1">
                {keyFeatures.map((feature, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {feature}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Dependencies */}
          {dependencies.length > 0 && (
            <div className="mt-3">
              <h4 className="text-sm font-medium text-foreground mb-2">Dependencies:</h4>
              <div className="flex flex-wrap gap-1">
                {dependencies.map((dep, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {dep}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Code Editor Section */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-foreground">
                Indicator Implementation
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
            {/* Deploy Indicator Button */}
            <Button
              onClick={handleDeployIndicator}
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
                  Deploy Indicator
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
                  Creating Indicator...
                </>
              )}
              {creationStatus === 'success' && (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Indicator Created!
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
                  Create Indicator
                </>
              )}
            </Button>
          </div>

          {/* Indicator Creation Success Message */}
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
                    Indicator Created Successfully!
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Your indicator is now created and ready to deploy for data calculation.
                  </p>
                  {createdAgentId && (
                    <p className="text-xs text-muted-foreground mt-1 font-mono">
                      Indicator ID: <span className="text-primary font-medium">{createdAgentId}</span>
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* Deploy Indicator Status Messages */}
          {deployStatus === 'deployed' && (
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="p-4 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg"
            >
              <div className="flex items-center">
                <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse mr-3"></div>
                <div>
                  <p className="text-sm font-medium text-green-800 dark:text-green-200">
                    Indicator Deployed
                  </p>
                  <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                    Your indicator is now live and calculating data for strategies to use.
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
                    Failed to Deploy Indicator
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