import { Section } from "@/components/section";
import { siteConfig } from "@/lib/config";
import { cn } from "@/lib/utils";
import {
  PhoneCall,
  MessageSquare,
  Shield,
  FileText,
  Lock,
  Search,
  Clock,
  Wifi,
} from "lucide-react";

// Mock phone interface for Sales Call Insights
const PhoneCallMockup = () => (
  <div className="relative max-w-xs mx-auto">
    <div className="bg-gray-300 dark:bg-gray-700 rounded-3xl p-0.5 shadow-lg">
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
          <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full mx-auto flex items-center justify-center">
            <PhoneCall className="w-8 h-8 text-white" />
          </div>
          <div>
            <div className="text-sm font-medium">Sales Call Analysis</div>
            <div className="text-xs text-gray-500">Recording... 00:14:32</div>
          </div>
          <div className="bg-purple-500 text-white px-3 py-1 rounded-full text-xs inline-flex items-center gap-1">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            Live
          </div>
        </div>
        {/* Analysis preview */}
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 text-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Pricing Objections</span>
            <span className="text-purple-600 font-medium">3 detected</span>
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
    <div className="bg-white dark:bg-gray-900 rounded-lg border shadow-sm overflow-hidden">
      <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 dark:bg-gray-800 border-b">
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
          <MessageSquare className="w-5 h-5 text-purple-500" />
          <span className="text-sm font-medium">Support Agent Dashboard</span>
        </div>
        <div className="space-y-2">
          <div className="bg-purple-50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-800 rounded p-3">
            <div className="text-xs text-purple-600 dark:text-purple-400 mb-1">
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
      <div className="w-8 h-8 bg-gray-600 rounded flex items-center justify-center">
        <span className="text-white text-xs font-bold">N</span>
      </div>
      <div className="w-8 h-8 bg-gray-600 rounded flex items-center justify-center">
        <span className="text-white text-xs font-bold">C</span>
      </div>
      <div className="w-8 h-8 bg-gray-600 rounded flex items-center justify-center">
        <span className="text-white text-xs font-bold">Z</span>
      </div>
    </div>
  </div>
);

// Mock security dashboard for Internal Policy Q&A
const PolicyMockup = () => (
  <div className="max-w-sm mx-auto space-y-4">
    {/* Security dashboard */}
    <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-lg p-4 text-white shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <Shield className="w-5 h-5 text-purple-400" />
        <span className="text-sm font-medium">Internal Policy System</span>
        <div className="ml-auto w-2 h-2 bg-purple-400 rounded-full"></div>
      </div>
      <div className="space-y-3">
        <div className="bg-gray-800 rounded p-3">
          <div className="text-xs text-gray-400 mb-1">Slack Query:</div>
          <div className="text-sm">
            &ldquo;What&apos;s our remote work policy?&rdquo;
          </div>
        </div>
        <div className="bg-purple-900/30 border border-purple-500/50 rounded p-3">
          <div className="text-xs text-purple-300 mb-1">Response:</div>
          <div className="text-sm">HR Policy Doc Section 4.2:</div>
          <div className="text-xs text-gray-300 mt-1">
            &ldquo;Remote work is allowed up to 3 days per week...&rdquo;
          </div>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-400">On-premise • Encrypted</span>
          <div className="flex items-center gap-1 text-purple-400">
            <Lock className="w-3 h-3" />
            <span>Secure</span>
          </div>
        </div>
      </div>
    </div>
    {/* File icons */}
    <div className="flex justify-center gap-2">
      <div className="w-8 h-8 bg-gray-600 rounded flex items-center justify-center">
        <FileText className="w-4 h-4 text-white" />
      </div>
      <div className="w-8 h-8 bg-gray-600 rounded flex items-center justify-center">
        <FileText className="w-4 h-4 text-white" />
      </div>
      <div className="w-8 h-8 bg-gray-600 rounded flex items-center justify-center">
        <FileText className="w-4 h-4 text-white" />
      </div>
    </div>
  </div>
);

// Mock developer docs interface
const DevDocsMockup = () => (
  <div className="max-w-sm mx-auto space-y-4">
    {/* Code editor interface */}
    <div className="bg-gray-900 rounded-lg overflow-hidden border shadow-sm">
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
          <Search className="w-4 h-4 text-purple-400" />
          <div className="flex-1 bg-gray-800 rounded px-2 py-1 text-sm text-gray-300">
            Search documentation...
          </div>
        </div>
        <div className="space-y-2">
          <div className="bg-gray-800 rounded p-2">
            <div className="text-purple-400 text-xs font-mono">POST /embed</div>
            <div className="text-gray-300 text-xs mt-1">
              Upload and embed documents
            </div>
          </div>
          <div className="bg-gray-800 rounded p-2">
            <div className="text-purple-400 text-xs font-mono">GET /search</div>
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
      <div className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-xs text-gray-600 dark:text-gray-400">
        React
      </div>
      <div className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-xs text-gray-600 dark:text-gray-400">
        Python
      </div>
      <div className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-xs text-gray-600 dark:text-gray-400">
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
                className="relative overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 shadow-sm hover:shadow-md transition-all duration-300"
              >
                {/* Purple accent stripe */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-purple-600"></div>

                <div className="p-8">
                  {/* Visual mockup */}
                  <div className="mb-8 flex justify-center">
                    {visualComponents[index]}
                  </div>

                  {/* Content */}
                  <div className="flex flex-col items-center text-center space-y-4">
                    <div className="p-3 rounded-xl bg-purple-50 dark:bg-purple-950/20 border border-purple-100 dark:border-purple-900/50">
                      <div className="text-purple-600 dark:text-purple-400">
                        {Icon}
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold text-foreground text-balance">
                      {name}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed text-balance max-w-md mx-auto">
                      {description}
                    </p>
                  </div>
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </Section>
  );
}
