import crypto from "crypto";
import { execSync } from "child_process";

export function generateSeed() {
    try {
        const startTime = new Date()
            .toISOString()
            .replace(/[-:TZ]/g, "")
            .slice(0, 12); // YYYYMMDDHHmm

        const remoteUrl = execSync("git config --get remote.origin.url")
            .toString()
            .trim();

        const firstCommit = execSync(
            "git log --reverse --format=%ct | head -n1"
        )
            .toString()
            .trim();

        const raw = `${remoteUrl}|${firstCommit}|${startTime}`;

        const seed = crypto.createHash("sha256").update(raw).digest("hex").slice(0, 12);

        return seed;
    } catch (err) {
        console.error("Seed oluşturulurken hata oluştu:", err.message);
        return "000000000000";
    }
}

export function generateCoefficients(seed) {
    const A = 7 + (parseInt(seed.slice(0, 2), 16) % 5);
    const B = 13 + (parseInt(seed.slice(2, 4), 16) % 7);
    const C = 3 + (parseInt(seed.slice(4, 6), 16) % 3);
    return { A, B, C };
}

/**
 * Örnek kullanım formülü
 */
export function calculatePriorityScore(base, signupLatencyMs, accountAgeDays, rapidActions, seed) {
    const { A, B, C } = generateCoefficients(seed);
    return base + (signupLatencyMs % A) + (accountAgeDays % B) - (rapidActions % C);
}

// Test amaçlı
if (process.argv[1].includes("seed.js")) {
    const seed = generateSeed();
    const { A, B, C } = generateCoefficients(seed);
    console.log("Seed:", seed);
    console.log("Katsayılar →", { A, B, C });

    const exampleScore = calculatePriorityScore(100, 233, 14, 5, seed);
    console.log("Örnek priority_score:", exampleScore);
}