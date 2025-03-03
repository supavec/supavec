"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { AppSidebar } from "@/components/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsContent, TabsTrigger } from "@/components/ui/tabs";

export default function DashboardLoading() {
  return (
    <SidebarProvider>
      <AppSidebar user={null} team={null} />
      <SidebarInset>
        <header className="border-b flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Skeleton className="h-5 w-24" />
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="rounded-xl p-4">
            <Skeleton className="h-8 w-64 mb-4" />
            <Skeleton className="h-5 w-80" />
          </div>
          <div className="min-h-[100vh] flex-1 rounded-xl md:min-h-min p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="p-4 rounded-xl border basis-full md:basis-1/2">
                <Skeleton className="h-6 w-40 mb-4" />
                <Skeleton className="h-5 w-72 mb-4" />
                <Skeleton className="h-10 w-full max-w-md" />
              </div>
              <div className="p-4 rounded-xl border basis-full md:basis-1/2">
                <Skeleton className="h-6 w-40 mb-4" />
                <Skeleton className="h-5 w-72 mb-4" />
                <Skeleton className="h-10 w-full max-w-md" />
              </div>
            </div>

            <div className="flex gap-4 flex-col">
              <Skeleton className="h-6 w-32 mb-4 mt-8" />
              <div className="min-h-[50vh] flex-1 rounded-xl bg-muted/50 md:min-h-min p-4 border">
                <Tabs defaultValue="upload" className="space-y-4">
                  <TabsList>
                    <TabsTrigger value="upload">Upload files</TabsTrigger>
                    <TabsTrigger value="content">Submit Content</TabsTrigger>
                  </TabsList>
                  <TabsContent value="upload" className="space-y-4">
                    <div className="mt-6">
                      <Skeleton className="h-6 w-32 mb-4" />
                      <Skeleton className="h-5 w-64 mb-4" />
                      <Skeleton className="h-32 w-full mb-4" />
                      <div className="space-y-2">
                        <Skeleton className="h-16 w-full" />
                        <Skeleton className="h-16 w-full" />
                      </div>
                    </div>
                  </TabsContent>
                  <TabsContent value="content" className="space-y-4">
                    <div className="mt-6">
                      <Skeleton className="h-6 w-32 mb-4" />
                      <Skeleton className="h-5 w-64 mb-4" />
                      <Skeleton className="h-32 w-full mb-4" />
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
              <div className="min-h-[50vh] flex-1 rounded-xl bg-muted/50 md:min-h-min p-4 border">
                <Skeleton className="h-6 w-32 mb-4" />
                <div className="space-y-4">
                  <Skeleton className="h-24 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
