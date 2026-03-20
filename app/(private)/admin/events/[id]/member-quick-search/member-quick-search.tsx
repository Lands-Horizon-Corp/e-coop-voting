"use client";

import React, { useState, useEffect } from "react";
import {
  Search,
  User,
  Fingerprint,
  Loader2,
  QrCode,
  X,
  Phone,
  Calendar,
  Key,
  CheckCircle2,
  Ticket,
} from "lucide-react";
import { useMemberSearch } from "@/hooks/api-hooks/use-quick-search";

import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import QrReader from "@/components/qr-reader";

import { TEventWithElection } from "@/types";
import { Actions } from "../manage-member/_components/member-table/column";
import { formatBirthday } from "@/lib/utils";

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
  const [isScanning, setIsScanning] = useState(true);

  useEffect(() => {
    setMounted(true);
  }, []);

  const { data, isLoading, isFetching } = useMemberSearch({
    eventId,
    query: searchTerm,
    limit: 10,
    enabled: searchTerm.trim().length >= 3,
  });

  const members = data?.data || [];

  const handleQrScan = (qrCodes: any[]) => {
    if (qrCodes.length > 0) {
      const { rawValue } = qrCodes[0];
      setSearchTerm(rawValue);
    }
  };

  if (!mounted) return null;

  return (
    <div className="w-full h-screen flex flex-col bg-background text-foreground">
      {/* Search Header */}
      <div className="border-b border-border bg-card px-4 py-3">
        <div className="max-w-5xl mx-auto relative group">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center">
            {isFetching ? (
              <Loader2 className="h-4 w-4 animate-spin text-primary" />
            ) : (
              <Search className="h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            )}
          </div>

          <Input
            placeholder="Search name or scan QR..."
            className="pl-10 pr-20 h-10 rounded-lg border-border bg-background text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            autoFocus
          />

          <div className="absolute right-1 top-1/2 -translate-y-1/2 flex items-center gap-1">
            {searchTerm && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSearchTerm("")}
                className="h-8 w-8"
              >
                <X size={16} />
              </Button>
            )}

            <Button
              variant={isScanning ? "default" : "secondary"}
              size="icon"
              onClick={() => setIsScanning(!isScanning)}
              className="h-8 w-8"
            >
              <QrCode size={16} />
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <div
          className={`h-full grid gap-0 ${
            isScanning ? "grid-cols-1 lg:grid-cols-3" : "grid-cols-1"
          }`}
        >
          {/* Members List */}
          <div
            className={`flex flex-col overflow-hidden ${
              isScanning ? "lg:col-span-2 border-r border-border" : ""
            }`}
          >
            {isLoading ? (
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-32 w-full rounded-lg" />
                ))}
              </div>
            ) : members.length > 0 ? (
              <div className="flex-1 overflow-y-auto p-4 space-y-2">
                {members.map((member) => (
                  <Card
                    key={member.id}
                    className="overflow-hidden hover:bg-card/80 transition-colors rounded-lg border border-border"
                  >
                    <CardContent className="p-3 flex gap-3">
                      {/* Avatar & Action */}
                      <div className="flex flex-col items-center gap-2 shrink-0">
                        <Avatar className="h-12 w-12 border border-border rounded-md">
                          <AvatarImage
                            src={member.picture ?? ""}
                            className="object-cover"
                          />
                          <AvatarFallback className="bg-muted text-muted-foreground text-xs">
                            <User size={20} />
                          </AvatarFallback>
                        </Avatar>
                        <Actions event={event} member={member as any} />
                      </div>
                      <div className="flex-1 min-w-0 space-y-2">
                        <div className="flex flex-wrap gap-1">
                          <Badge
                            variant="outline"
                            className="text-xs font-mono px-1.5 py-0 h-5"
                          >
                            <Fingerprint size={11} className="mr-0.5" />
                            {member.passbookNumber}
                          </Badge>

                          {member.registered && (
                            <Badge className="text-xs px-1.5 py-0 h-5 bg-primary text-primary-foreground">
                              <CheckCircle2 size={11} className="mr-0.5" />{" "}
                              Registered
                            </Badge>
                          )}
                          {member.voted && (
                            <Badge className="text-xs px-1.5 py-0 h-5 bg-secondary text-secondary-foreground">
                              VOTED
                            </Badge>
                          )}
                          {member.surveyed && (
                            <Badge className="text-xs px-1.5 py-0 h-5 bg-accent text-accent-foreground">
                              <Ticket size={11} className="mr-0.5" /> SURVEY
                            </Badge>
                          )}
                        </div>
                        <h3 className="text-sm font-semibold text-foreground truncate">
                          {member.lastName}, {member.firstName}
                        </h3>
                        <div className="grid grid-cols-2 gap-1 text-xs">
                          <div className="flex items-center gap-1 text-muted-foreground truncate">
                            <Phone size={12} className="shrink-0" />
                            <span className="truncate">
                              {member.contact || "—"}
                            </span>
                          </div>
                          <div className="flex items-center gap-1 text-muted-foreground truncate">
                            <Calendar size={12} className="shrink-0" />
                            <span className="truncate">
                              {member.birthday
                                ? formatBirthday(member.birthday)
                                : "—"}
                            </span>
                          </div>
                        </div>

                        {/* OTP */}
                        <div className="flex items-center justify-between bg-muted/50 rounded-md p-2 border border-border/50">
                          <div className="flex items-center gap-1">
                            <Key size={12} className="text-primary" />
                            <span className="text-xs font-semibold text-muted-foreground">
                              OTP
                            </span>
                          </div>
                          <span className="text-sm font-mono font-bold text-primary">
                            {member.voteOtp || "—"}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">
                    {searchTerm ? "No members found" : "Start searching"}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* QR Scanner Column */}
          {isScanning && (
            <div className="hidden lg:flex flex-col items-center justify-start gap-3 p-4 bg-card border-l border-border">
              <div className="relative overflow-hidden rounded-lg border border-border bg-black aspect-square w-full ">
                <QrReader
                  onScan={handleQrScan}
                  scanDelay={2000}
                  components={{ zoom: true, torch: true, finder: true }}
                  classNames={{ container: "size-full" }}
                />
              </div>
              <p className="text-xs text-primary font-semibold uppercase tracking-wide animate-pulse">
                Scanning
              </p>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setIsScanning(false)}
                className="w-full"
              >
                <X className="mr-1 h-3 w-3" /> Close Scanner
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
