import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import {
  CheckCircle2,
  Clock,
  MessageSquare,
  RefreshCw,
  XCircle,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import type { SmsRecord } from "../backend.d";
import { useGetSmsHistory } from "../hooks/useQueries";

function formatTimestamp(ts: bigint): string {
  const ms = Number(ts / BigInt(1_000_000));
  const date = new Date(ms);
  return date.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function HistoryItem({ record, index }: { record: SmsRecord; index: number }) {
  const isSuccess = record.status === "success" || record.status === "sent";
  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.25, delay: index * 0.04 }}
      data-ocid={`history.item.${index + 1}`}
      className="flex items-start gap-3 p-4 rounded-xl hover:bg-secondary/60 transition-colors"
    >
      <div
        className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
          isSuccess ? "bg-success/15" : "bg-destructive/15"
        }`}
      >
        {isSuccess ? (
          <CheckCircle2 className="w-4 h-4 text-success" />
        ) : (
          <XCircle className="w-4 h-4 text-destructive" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2 mb-1">
          <span className="text-sm font-semibold text-card-foreground truncate">
            {record.phone}
          </span>
          <Badge
            variant={isSuccess ? "default" : "destructive"}
            className={`text-xs px-2 py-0 shrink-0 ${
              isSuccess
                ? "bg-success/15 text-success border-success/30 hover:bg-success/20"
                : ""
            }`}
          >
            {isSuccess ? "Sent" : "Failed"}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground truncate">
          {record.message}
        </p>
        <p className="text-xs text-muted-foreground/70 mt-1">
          {formatTimestamp(record.timestamp)}
        </p>
      </div>
    </motion.div>
  );
}

export function SmsHistory() {
  const { data: history, isLoading, refetch, isFetching } = useGetSmsHistory();

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="bg-card border border-border rounded-2xl shadow-card h-full flex flex-col"
    >
      <div className="flex items-center justify-between p-6 pb-4 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <Clock className="w-4 h-4 text-primary" />
          </div>
          <h2 className="text-lg font-semibold text-card-foreground">
            Message History
          </h2>
          {history && history.length > 0 && (
            <span className="text-xs bg-primary/10 text-primary rounded-full px-2 py-0.5 font-medium">
              {history.length}
            </span>
          )}
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => refetch()}
          disabled={isFetching}
          data-ocid="history.secondary_button"
          className="h-8 w-8 rounded-lg"
        >
          <RefreshCw
            className={`w-4 h-4 ${isFetching ? "animate-spin" : ""}`}
          />
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-3">
          {isLoading ? (
            <div data-ocid="history.loading_state" className="space-y-3 p-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex gap-3">
                  <Skeleton className="w-8 h-8 rounded-lg shrink-0" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-full" />
                    <Skeleton className="h-3 w-1/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : !history || history.length === 0 ? (
            <div
              data-ocid="history.empty_state"
              className="flex flex-col items-center justify-center py-16 text-center"
            >
              <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center mb-4">
                <MessageSquare className="w-7 h-7 text-muted-foreground" />
              </div>
              <p className="text-sm font-medium text-muted-foreground">
                No messages yet
              </p>
              <p className="text-xs text-muted-foreground/70 mt-1">
                Your sent messages will appear here
              </p>
            </div>
          ) : (
            <AnimatePresence>
              {history.map((record, i) => (
                <HistoryItem
                  key={record.id.toString()}
                  record={record}
                  index={i}
                />
              ))}
            </AnimatePresence>
          )}
        </div>
      </ScrollArea>
    </motion.div>
  );
}
