import { expect } from "jsr:@std/expect";
import { beforeAll, describe, it } from "jsr:@std/testing/bdd";
import type { Insight } from "$models/insight.ts";
import { withDB } from "../testing.ts";
import listInsights from "./list-insights.ts";

function omit<T extends object, K extends keyof T>(obj: T, key: K | "brand"): Omit<T, K | "brand"> {
  const { [key]: _, ...rest } = obj;
  return rest;
}

describe("listing insights in the database", () => {
  describe("nothing in the DB", () => {
    withDB((fixture) => {
      let result: Insight[];

      beforeAll(() => {
        result = listInsights(fixture);
      });

      it("returns empty result", () => {
        expect(result).toEqual([]);
      });
    });
  });

  describe("populated DB", () => {
    withDB((fixture) => {
      const insights: Insight[] = [
        { id: 1, brandId: 0, createdAt: new Date(), text: "1" },
        { id: 2, brandId: 0, createdAt: new Date(), text: "2" },
        { id: 3, brandId: 1, createdAt: new Date(), text: "3" },
        { id: 4, brandId: 4, createdAt: new Date(), text: "4" },
      ];

      let result: Insight[];

      beforeAll(() => {
        fixture.insights.insert(
          insights.map((it) => ({
            ...it,
            brand: it.brandId,
            createdAt: it.createdAt.toISOString(),
          })),
        );
        result = listInsights(fixture);
      });

      it("returns non-empty result", () => {
        expect(result.length).toBeGreaterThan(0);
      });

      it("returns all insights in the DB", () => {
        const resultWithoutBrand = result.map((it) => omit(it, "brand"));
        expect(resultWithoutBrand).toEqual(insights);
      });
    });
  });
});
