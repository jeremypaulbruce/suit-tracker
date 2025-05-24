import type { Insight } from "$models/insight.ts";
import type { HasDBClient } from "../shared.ts";
import type * as insightsTable from "$tables/insights.ts";

type Input = HasDBClient & {
  id: number;
};

export default (input: Input): Insight | undefined => {
  console.log(`deleting insight for id=${input.id}`);

  const [row] = input.db
    .sql<
    insightsTable.Row
  >`DELETE FROM insights WHERE id = ${input.id} LIMIT 1`;

  return;
};