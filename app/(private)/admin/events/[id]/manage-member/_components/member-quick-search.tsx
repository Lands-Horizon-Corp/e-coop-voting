"use client";

import React, { useState, useMemo, useEffect } from "react";
import { Search, User, Fingerprint, ChevronRight, Loader2 } from "lucide-react";
import { useMemberSearch } from "@/hooks/api-hooks/use-quick-search";

import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

import { Actions } from "./member-table/column";
import { TEventWithElection } from "@/types";

interface MemberSearchPageProps {
  eventId: number;
  event: TEventWithElection;
}

export default function MemberSearchPage({
  eventId,
  event,
}: MemberSearchPageProps) {
  const [mounted, setMounted] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

  // Use searchTerm directly. The hook handles the 400ms debounce internally.
  const { data, isLoading, isFetching, isError, error } = useMemberSearch({
    eventId,
    query: searchTerm,
    limit: 10,
    enabled: searchTerm.trim().length >= 3, // Trigger only on high-quality queries
  });

  const members = data?.data || [];

  if (!mounted) return null;

  return (
    <div className="w-full mx-auto p-4 space-y-6">
      <div className="relative group">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center">
          {isFetching ? (
            <Loader2 className="h-4 w-4 animate-spin text-primary" />
          ) : (
            <Search className="h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
          )}
        </div>
        <Input
          placeholder="Type at least 3 characters to search..."
          className="pl-10 h-12 rounded-xl bg-background border-2 focus-visible:ring-primary shadow-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          autoFocus
        />
        {searchTerm.length > 0 && searchTerm.length < 3 && (
          <p className="text-[10px] text-muted-foreground mt-1 ml-2 italic">
            Keep typing to search...
          </p>
        )}
      </div>

      <div className="space-y-3">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center space-x-4 p-4 border rounded-xl bg-card"
            >
              <Skeleton className="h-14 w-14 rounded-full" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-5 w-48" />
              </div>
            </div>
          ))
        ) : isError ? (
          <div className="p-4 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-xl">
            {error?.message || "Search failed. Please try again."}
          </div>
        ) : (
          members.map((member) => (
            <Card
              key={member.id}
              className="group hover:ring-2 hover:ring-primary/20 hover:border-primary/30 transition-all rounded-xl cursor-default"
            >
              <CardContent className="p-4 flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div onClick={(e) => e.stopPropagation()}>
                    <Actions event={event} member={member as any} />
                  </div>
                </div>
                <Avatar className="h-14 w-14 border border-muted shadow-sm">
                  <AvatarImage
                    src={member.picture ?? ""}
                    alt={member.firstName}
                    className="object-cover"
                  />
                  <AvatarFallback className="bg-muted">
                    <User size={20} className="text-muted-foreground" />
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge
                      variant="outline"
                      className="font-mono bg-muted/50 border-none px-1.5 py-0"
                    >
                      <Fingerprint size={10} className="mr-1 opacity-70" />
                      {member.passbookNumber}
                    </Badge>
                    {member.voted && (
                      <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-[9px] h-4">
                        VOTED
                      </Badge>
                    )}
                  </div>

                  <h3 className="text-base font-bold truncate tracking-tight text-foreground uppercase">
                    {member.lastName}, {member.firstName}
                  </h3>
                  <p className="text-[11px] text-muted-foreground">
                    Assisted by{" "}
                    <span className="text-foreground font-medium">
                      {member.registeredBy?.name || "System"}
                    </span>
                  </p>
                </div>
              </CardContent>
            </Card>
          ))
        )}
        {searchTerm.length >= 3 && members.length === 0 && !isLoading && (
          <div className="text-center py-16 border-2 border-dashed rounded-2xl bg-muted/20">
            <Search className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-sm text-muted-foreground font-medium">
              No results for{" "}
              <span className="text-foreground">"{searchTerm}"</span>
            </p>
            <p className="text-xs text-muted-foreground/60 mt-1">
              Check the spelling or try a different keyword
            </p>
          </div>
        )}
        {searchTerm.length < 3 && !isLoading && (
          <div className="text-center py-12 opacity-40">
            <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
              Member Registry Search
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
