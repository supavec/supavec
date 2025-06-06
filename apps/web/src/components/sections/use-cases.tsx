import { Section } from "@/components/section";
import { siteConfig } from "@/lib/config";
import { cn } from "@/lib/utils";
import {
  PhoneCall,
  MessageSquare,
  Shield,
  FileText,
  Zap,
  Lock,
  Brain,
  Search,
  Users,
  Settings,
  BarChart3,
  MessageCircle,
  Headphones,
  Clock,
  Star,
  CheckCircle,
  Database,
  Globe,
  Smartphone,
  Monitor,
  Wifi,
  Cpu,
} from "lucide-react";

// Mock phone interface for Sales Call Insights
const PhoneCallMockup = () => (
  <div className="relative max-w-xs mx-auto">
    <div className="bg-gradient-to-br from-gray-900 to-black rounded-3xl p-1 shadow-2xl">
      <div className="bg-white dark:bg-gray-900 rounded-3xl p-4 space-y-4">
        {/* Status bar */}
        <div className="flex justify-between items-center text-xs">
          <div className="flex items-center gap-1">
            <div className="flex gap-1">
              <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
              <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
              <div className="w-1 h-1 bg-gray-600 rounded-full"></div>
            </div>
            <span className="text-gray-600 ml-1">Verizon</span>
          </div>
          <div className="flex items-center gap-1">
            <Wifi className="w-3 h-3" />
            <div className="w-6 h-3 border border-gray-400 rounded-sm">
              <div className="w-4 h-1.5 bg-green-500 rounded-sm m-0.5"></div>
            </div>
          </div>
        </div>
        {/* Call interface */}
        <div className="text-center space-y-3">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mx-auto flex items-center justify-center">
            <PhoneCall className="w-8 h-8 text-white" />
          </div>
          <div>
            <div className="text-sm font-medium">Sales Call Analysis</div>
            <div className="text-xs text-gray-500">Recording... 00:14:32</div>
          </div>
          <div className="bg-red-500 text-white px-3 py-1 rounded-full text-xs inline-flex items-center gap-1">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            Live
          </div>
        </div>
        {/* Analysis preview */}
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 text-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Pricing Objections</span>
            <span className="text-red-500 font-medium">3 detected</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Next Steps Mentioned</span>
            <span className="text-green-500 font-medium">✓ Clear</span>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Mock support interface for Support Knowledge Copilot
const SupportMockup = () => (
  <div className="max-w-sm mx-auto space-y-4">
    {/* Browser window */}
    <div className="bg-white dark:bg-gray-900 rounded-lg border shadow-lg overflow-hidden">
      <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-gray-800 border-b">
        <div className="flex gap-1">
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
        </div>
        <div className="flex-1 bg-white dark:bg-gray-700 rounded px-2 py-1 text-xs text-gray-600">
          zendesk.com/agent/dashboard
        </div>
      </div>
      <div className="p-4 space-y-3">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-blue-500" />
          <span className="text-sm font-medium">Support Agent Dashboard</span>
        </div>
        <div className="space-y-2">
          <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded p-3">
            <div className="text-xs text-blue-600 dark:text-blue-400 mb-1">
              Question from customer:
            </div>
            <div className="text-sm">
              &ldquo;How do I reset my password?&rdquo;
            </div>
          </div>
          <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded p-3">
            <div className="text-xs text-green-600 dark:text-green-400 mb-1">
              AI Suggested Answer:
            </div>
            <div className="text-sm">
              From Knowledge Base → Password Reset Guide
            </div>
            <div className="text-xs text-gray-500 mt-1">
              Source: Confluence Page #47
            </div>
          </div>
        </div>
      </div>
    </div>
    {/* Connected services */}
    <div className="flex justify-center gap-3">
      <div className="w-8 h-8 bg-purple-500 rounded flex items-center justify-center">
        <span className="text-white text-xs font-bold">N</span>
      </div>
      <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center">
        <span className="text-white text-xs font-bold">C</span>
      </div>
      <div className="w-8 h-8 bg-green-500 rounded flex items-center justify-center">
        <span className="text-white text-xs font-bold">Z</span>
      </div>
    </div>
  </div>
);

// Mock security dashboard for Internal Policy Q&A
const PolicyMockup = () => (
  <div className="max-w-sm mx-auto space-y-4">
    {/* Security dashboard */}
    <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-lg p-4 text-white">
      <div className="flex items-center gap-2 mb-4">
        <Shield className="w-5 h-5 text-green-400" />
        <span className="text-sm font-medium">Internal Policy System</span>
        <div className="ml-auto w-2 h-2 bg-green-400 rounded-full"></div>
      </div>
      <div className="space-y-3">
        <div className="bg-gray-800 rounded p-3">
          <div className="text-xs text-gray-400 mb-1">Slack Query:</div>
          <div className="text-sm">
            &ldquo;What&apos;s our remote work policy?&rdquo;
          </div>
        </div>
        <div className="bg-blue-900/50 border border-blue-500 rounded p-3">
          <div className="text-xs text-blue-300 mb-1">Response:</div>
          <div className="text-sm">HR Policy Doc Section 4.2:</div>
          <div className="text-xs text-gray-300 mt-1">
            &ldquo;Remote work is allowed up to 3 days per week...&rdquo;
          </div>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-400">On-premise • Encrypted</span>
          <div className="flex items-center gap-1 text-green-400">
            <Lock className="w-3 h-3" />
            <span>Secure</span>
          </div>
        </div>
      </div>
    </div>
    {/* File icons */}
    <div className="flex justify-center gap-2">
      <div className="w-8 h-8 bg-red-500 rounded flex items-center justify-center">
        <FileText className="w-4 h-4 text-white" />
      </div>
      <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center">
        <FileText className="w-4 h-4 text-white" />
      </div>
      <div className="w-8 h-8 bg-green-500 rounded flex items-center justify-center">
        <FileText className="w-4 h-4 text-white" />
      </div>
    </div>
  </div>
);

// Mock developer docs interface
const DevDocsMockup = () => (
  <div className="max-w-sm mx-auto space-y-4">
    {/* Code editor interface */}
    <div className="bg-gray-900 rounded-lg overflow-hidden border">
      <div className="flex items-center gap-2 px-3 py-2 bg-gray-800 border-b border-gray-700">
        <div className="flex gap-1">
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
        </div>
        <span className="text-gray-300 text-xs">docs.supavec.com</span>
      </div>
      <div className="p-4 space-y-3">
        <div className="flex items-center gap-2">
          <Search className="w-4 h-4 text-blue-400" />
          <div className="flex-1 bg-gray-800 rounded px-2 py-1 text-sm text-gray-300">
            Search documentation...
          </div>
        </div>
        <div className="space-y-2">
          <div className="bg-gray-800 rounded p-2">
            <div className="text-green-400 text-xs font-mono">POST /embed</div>
            <div className="text-gray-300 text-xs mt-1">
              Upload and embed documents
            </div>
          </div>
          <div className="bg-gray-800 rounded p-2">
            <div className="text-blue-400 text-xs font-mono">GET /search</div>
            <div className="text-gray-300 text-xs mt-1">
              Query embedded content
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <Clock className="w-3 h-3" />
          <span>Response time: 287ms</span>
        </div>
      </div>
    </div>
    {/* Integration badges */}
    <div className="flex justify-center gap-2">
      <div className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 rounded text-xs text-purple-600 dark:text-purple-400">
        React
      </div>
      <div className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 rounded text-xs text-blue-600 dark:text-blue-400">
        Python
      </div>
      <div className="px-2 py-1 bg-green-100 dark:bg-green-900/30 rounded text-xs text-green-600 dark:text-green-400">
        Node.js
      </div>
    </div>
  </div>
);

export function UseCases({ className }: { className?: string }) {
  const visualComponents = [
    <PhoneCallMockup key="phone" />,
    <SupportMockup key="support" />,
    <PolicyMockup key="policy" />,
    <DevDocsMockup key="docs" />,
  ];

  return (
    <Section id="use-cases" title="Use Cases" className={cn(className)}>
      <div className="border-x border-t">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 lg:p-12">
          {siteConfig.whySupavec.map(
            ({ name, description, icon: Icon }, index) => (
              <div
                key={index}
                className={cn(
                  "relative overflow-hidden rounded-2xl border bg-gradient-to-br p-8 transition-all duration-300",
                  index === 0 &&
                    "from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20",
                  index === 1 &&
                    "from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20",
                  index === 2 &&
                    "from-gray-50 to-slate-50 dark:from-gray-950/20 dark:to-slate-950/20",
                  index === 3 &&
                    "from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20"
                )}
              >
                {/* Visual mockup */}
                <div className="mb-8 flex justify-center">
                  {visualComponents[index]}
                </div>

                {/* Content */}
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="p-3 rounded-2xl bg-white/80 dark:bg-gray-900/80 shadow-lg backdrop-blur-sm">
                    {Icon}
                  </div>
                  <h3 className="text-xl font-semibold text-foreground text-balance">
                    {name}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed text-balance max-w-md mx-auto">
                    {description}
                  </p>
                </div>

                {/* Decorative elements */}
                <div className="absolute top-4 right-4 w-2 h-2 bg-gradient-to-br from-white to-gray-200 dark:from-gray-600 dark:to-gray-800 rounded-full"></div>
                <div className="absolute bottom-4 left-4 w-1 h-1 bg-gradient-to-br from-white to-gray-200 dark:from-gray-600 dark:to-gray-800 rounded-full"></div>
              </div>
            )
          )}
        </div>
      </div>
    </Section>
  );
}
