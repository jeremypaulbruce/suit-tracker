import { expect } from "jsr:@std/expect";
import { beforeAll, describe, it } from "jsr:@std/testing/bdd";
import { withDB } from "../testing.ts";
import insertInsight from "./insert-insight.ts";
import listInsights from "./list-insights.ts";
import type { Insight } from "$models/insight.ts";

describe("insertInsight operation", () => {
  withDB((fixture) => {
    const input = {
      db: fixture.db,
      data: {
        brandId: 123,
        text: "Test insight",
      },
    };

    let result: boolean;
    let insights: Insight[];

    beforeAll(() => {
      result = insertInsight(input);
      insights = listInsights(fixture);
    });

    it("returns true on successful insert", () => {
      expect(result).toBe(true);
    });

    it("inserts the insight into the DB", () => {
      expect(insights.length).toBe(1);
      expect(insights[0].brandId).toBe(123);
      expect(insights[0].text).toBe("Test insight");
    });

    it("sets createdAt to a valid ISO string", () => {
      expect(typeof insights[0].createdAt).toBe("object"); // Should be Date
      expect(!isNaN(insights[0].createdAt.getTime())).toBe(true);
    });
  });

  withDB((fixture) => {
    it("does not insert when required fields are missing", () => {
      // @ts-expect-error: missing text
      const result = insertInsight({ db: fixture.db, data: { brandId: 1 } });
      expect(result).toBe(false);
      expect(listInsights(fixture)).toEqual([]);
    });
  });
});
