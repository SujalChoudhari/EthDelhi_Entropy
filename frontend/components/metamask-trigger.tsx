"use client";

import React, { useState } from "react";
import { useMetamask } from "@/hooks/useMetamask";

export default function MetamaskTrigger() {
  const { connect } = useMetamask();
  const [sending, setSending] = useState(false);
  const [copied, setCopied] = useState(false);

  const sendOneHbar = async () => {
    if (typeof (window as any) === "undefined" || !(window as any).ethereum) {
      alert("MetaMask (or compatible provider) not detected.");
      return;
    }

    try {
      // Ensure user is connected / prompt if not
      const accounts: string[] = await (window as any).ethereum.request({
        method: "eth_requestAccounts",
      });
      if (!accounts || accounts.length === 0) {
        await connect();
      }
      const from = accounts && accounts[0];
      if (!from) {
        alert("Wallet not connected.");
        return;
      }

      setSending(true);

      // NOTE: target address intentionally as requested (may be invalid)
      const to = "0x681B6D39e368C078f16BeAee371Bf85dF527854f";

      // Use Hedera tiny-unit assumption from prior notes (1 HBAR = 100,000,000 tinybars)
      const tinybars = BigInt(100_000_000);
      const valueHex = "0x" + tinybars.toString(16);

      const txHash = await (window as any).ethereum.request({
        method: "eth_sendTransaction",
        params: [
          {
            from,
            to,
            value: valueHex,
          },
        ],
      });

      alert(`Transaction submitted: ${txHash}`);
    } catch (err: any) {
      console.error("sendOneHbar error", err);
      alert("Transaction failed or was rejected: " + (err?.message || String(err)));
    } finally {
      setSending(false);
    }
  };

  const onReceive = async () => {
    if (typeof (window as any) === "undefined" || !(window as any).ethereum) {
      alert("MetaMask (or compatible provider) not detected.");
      return;
    }

    try {
      const accounts: string[] = await (window as any).ethereum.request({
        method: "eth_requestAccounts",
      });
      const addr = accounts && accounts[0];
      if (!addr) {
        await connect();
      }
      const finalAddr = addr || (accounts && accounts[0]) || "";
      if (!finalAddr) {
        alert("Wallet not connected.");
        return;
      }
      await navigator.clipboard.writeText(finalAddr);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch (err) {
      console.error("copy address error", err);
      alert("Could not copy address. Please copy it manually from your wallet.");
    }
  };

  return (
    <div className="flex gap-3 items-center">
      <button
        onClick={sendOneHbar}
        disabled={sending}
        className="px-4 py-2 bg-primary text-primary-foreground rounded-md shadow hover:bg-primary/90 disabled:opacity-60"
      >
        {sending ? "Sending..." : "Send 1 HBAR"}
      </button>

      <button
        onClick={onReceive}
        className="px-4 py-2 bg-secondary text-secondary-foreground rounded-md shadow hover:bg-secondary/80"
      >
        {copied ? "Address copied" : "Receive"}
      </button>
    </div>
  );
}