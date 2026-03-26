import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Info, Send } from "lucide-react";
import { Loader2 } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { COUNTRIES } from "../data/countries";
import { useSendSms } from "../hooks/useQueries";

const MAX_CHARS = 160;

export function ComposeForm() {
  const [selectedCountry, setSelectedCountry] = useState("US");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const sendSms = useSendSms();

  const country =
    COUNTRIES.find((c) => c.code === selectedCountry) ?? COUNTRIES[64];
  const charsLeft = MAX_CHARS - message.length;
  const isOverLimit = charsLeft < 0;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!phone.trim() || !message.trim() || isOverLimit) return;
    const fullPhone = `${country.dialCode}${phone.trim()}`;
    try {
      const result = await sendSms.mutateAsync({
        phone: fullPhone,
        message: message.trim(),
      });
      if (result.success) {
        toast.success("SMS sent successfully!", {
          description: `Delivered to ${fullPhone}`,
        });
        setPhone("");
        setMessage("");
      } else {
        toast.error("Failed to send SMS", { description: result.message });
      }
    } catch {
      toast.error("Something went wrong", { description: "Please try again" });
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-card border border-border rounded-2xl p-6 shadow-card h-full"
    >
      <div className="flex items-center gap-2 mb-6">
        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
          <Send className="w-4 h-4 text-primary" />
        </div>
        <h2 className="text-lg font-semibold text-card-foreground">
          Compose Message
        </h2>
      </div>

      {/* Free SMS notice */}
      <div className="flex gap-2 items-start bg-primary/8 border border-primary/20 rounded-xl p-3 mb-5">
        <Info className="w-4 h-4 text-primary mt-0.5 shrink-0" />
        <p className="text-xs text-primary leading-relaxed">
          <strong>Free tier limit:</strong> 1 SMS per day per IP via TextBelt.
          Upgrade for higher limits.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Country selector */}
        <div className="space-y-1.5">
          <Label htmlFor="country" className="text-sm font-medium">
            Country
          </Label>
          <Select value={selectedCountry} onValueChange={setSelectedCountry}>
            <SelectTrigger
              id="country"
              data-ocid="compose.select"
              className="w-full h-11 rounded-xl"
            >
              <SelectValue>
                <span className="flex items-center gap-2">
                  <span className="text-base">{country.flag}</span>
                  <span>{country.name}</span>
                  <span className="text-muted-foreground">
                    {country.dialCode}
                  </span>
                </span>
              </SelectValue>
            </SelectTrigger>
            <SelectContent className="max-h-72">
              {COUNTRIES.map((c) => (
                <SelectItem key={c.code} value={c.code}>
                  <span className="flex items-center gap-2">
                    <span className="text-base">{c.flag}</span>
                    <span>{c.name}</span>
                    <span className="text-muted-foreground text-sm">
                      {c.dialCode}
                    </span>
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Phone number */}
        <div className="space-y-1.5">
          <Label htmlFor="phone" className="text-sm font-medium">
            Phone Number
          </Label>
          <div className="flex gap-2">
            <div className="flex items-center px-3 h-11 rounded-xl border border-border bg-secondary text-secondary-foreground text-sm font-medium min-w-[60px] justify-center">
              {country.dialCode}
            </div>
            <Input
              id="phone"
              data-ocid="compose.input"
              type="tel"
              placeholder="5551234567"
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
              className="flex-1 h-11 rounded-xl"
              required
            />
          </div>
        </div>

        {/* Message */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="message" className="text-sm font-medium">
              Message
            </Label>
            <span
              data-ocid="compose.loading_state"
              className={`text-xs font-medium tabular-nums ${
                isOverLimit
                  ? "text-destructive"
                  : charsLeft <= 20
                    ? "text-chart-3"
                    : "text-muted-foreground"
              }`}
            >
              {charsLeft}/{MAX_CHARS}
            </span>
          </div>
          <Textarea
            id="message"
            data-ocid="compose.textarea"
            placeholder="Type your message here..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={4}
            className="rounded-xl resize-none"
            required
          />
        </div>

        <Button
          type="submit"
          data-ocid="compose.submit_button"
          disabled={sendSms.isPending || !phone || !message || isOverLimit}
          className="w-full h-11 rounded-xl font-semibold text-base"
        >
          {sendSms.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Sending...
            </>
          ) : (
            <>
              <Send className="mr-2 h-4 w-4" />
              Send SMS
            </>
          )}
        </Button>
      </form>
    </motion.div>
  );
}
