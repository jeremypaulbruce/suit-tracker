import type { HasDBClient } from "../shared.ts";
import { insertStatement } from "$tables/insights.ts";

type Input = HasDBClient & {
    data: {
        brandId: number;
        text: string;   
    };
};

export default (input: Input): boolean => {
    // Validate input data
    if (
        typeof input.data.brandId !== "number" ||
        typeof input.data.text !== "string" ||
        !input.data.text.trim()
    ) {
        return false;
    }

    const createdAt     = new Date().toISOString();
    const params        = [input.data.brandId, input.data.text, createdAt];
    const result        = input.db.prepare(insertStatement).run(...params);
    const newInsight    = {brandId: input.data.brandId, text: input.data.text, createdAt: new Date(createdAt) };

    console.log("Insight inserted:", newInsight);
    
    return Boolean(result);
};
