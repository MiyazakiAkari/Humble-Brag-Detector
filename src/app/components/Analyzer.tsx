"use client";

import { useState } from "react";
import styles from "./Analyzer.module.css";

type AnalysisResult = {
    isHumbleBrag: boolean;
    reason: string;
    bragLevel: number;
};

export default function Analyzer() {
    const [text, setText] = useState("");
    const [result, setResult] = useState<AnalysisResult | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const analyze = async () => {
        if (!text.trim()) return;
        setLoading(true);
        setError("");
        setResult(null);

        try {
            const res = await fetch("/api/analyze", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text }),
            });

            if (!res.ok) throw new Error("Analysis failed");

            const data = await res.json();
            setResult(data);
        } catch (err) {
            setError("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <textarea
                className={styles.textarea}
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="ここに発言を入力してください..."
                rows={4}
            />

            <button
                className={styles.button}
                onClick={analyze}
                disabled={loading || !text.trim()}
            >
                {loading ? "Analyzing..." : "Analyze"}
            </button>

            {error && <p className={styles.error}>{error}</p>}

            {result && (
                <div className={`${styles.result} ${result.isHumbleBrag ? styles.guilty : styles.innocent}`}>
                    <h2 className={styles.verdict}>
                        {result.isHumbleBrag ? "🚨 GUILTY 🚨" : "✅ INNOCENT"}
                    </h2>
                    <div className={styles.meter}>
                        <div
                            className={styles.level}
                            style={{ width: `${result.bragLevel}%` }}
                        >
                            Brag Level: {result.bragLevel}%
                        </div>
                    </div>
                    <p className={styles.reason}>{result.reason}</p>
                </div>
            )}
        </div>
    );
}
