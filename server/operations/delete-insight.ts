import type { Insight } from "$models/insight.ts";
import type { HasDBClient } from "../shared.ts";
import * as insightsTable from "$tables/insights.ts";

type Input = HasDBClient & {
  id: number;
};

export default (input: Input): Insight | undefined => {
  console.log(`deleting insight for id=${input.id}`);

  const changes = input.db.prepare(insightsTable.deleteStatement).run(input.id);

  if (changes === 0) {
    console.log(`No insight found with id=${input.id}`);
    return undefined;
  }

  return;
};