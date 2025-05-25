import { expect } from "jsr:@std/expect";
import { beforeAll, describe, it } from "jsr:@std/testing/bdd";
import { withDB } from "../testing.ts";
import type { Insight } from "$models/insight.ts";
import deleteInsight from "./delete-insight.ts";
import listInsights from "./list-insights.ts";

describe("delete Insight operation", () => {
  describe("when the DB is empty", () => {
    withDB((fixture) => {
      let result: Insight | undefined;

      beforeAll(() => {
        result = deleteInsight({ db: fixture.db, id: 1 });
      });

      it("returns undefined", () => {
        expect(result).toBeUndefined();
      });

      it("does not affect the DB", () => {
        expect(listInsights(fixture)).toEqual([]);
      });
    });
  });

  describe("when the insight exists", () => {
    withDB((fixture) => {
      const insight: Insight = {
        id: 42,
        brandId: 1,
        text: "to be deleted",
        createdAt: new Date(),
      };

      beforeAll(() => {
        fixture.insights.insert([{
          ...insight,
          createdAt: insight.createdAt.toISOString(),
        }]);
      });

      let result: Insight | undefined;

      beforeAll(() => {
        result = deleteInsight({ db: fixture.db, id: insight.id });
      });

      it("returns undefined", () => {
        expect(result).toBeUndefined();
      });

      it("removes the insight from the DB", () => {
        expect(listInsights(fixture)).toEqual([]);
      });
    });
  });

  describe("when the insight does not exist", () => {
    withDB((fixture) => {
      beforeAll(() => {
        // Insert a different insight
        fixture.insights.insert([{
          id: 1,
          brandId: 2,
          createdAt: new Date().toISOString(),
          text: "keep me",
        }]);
      });

      let result: Insight | undefined;

      beforeAll(() => {
        result = deleteInsight({ db: fixture.db, id: 999 });
      });

      it("returns undefined", () => {
        expect(result).toBeUndefined();
      });

      it("does not delete any insights", () => {
        const insights = listInsights(fixture);
        expect(insights.length).toBe(1);
        expect(insights[0].text).toBe("keep me");
      });
    });
  });
});