import { Trash2Icon } from "lucide-react";
import { cx } from "../../lib/cx.ts";
import styles from "./insights.module.css";
import type { Insight } from "../../schemas/insight.ts";
import { BRANDS } from "../../lib/consts.ts";
import { formatDistanceToNow } from "https://esm.sh/date-fns@3.6.0";

type InsightsProps = {
  insights: Insight[];
  className?: string;
  onDelete?: (id: number) => Promise<void>;
};

export const Insights = ({ insights, className, onDelete }: InsightsProps) => {
  const deleteInsight = async (id: number) => {
    try {
      await fetch(`/api/insights/delete/${id}`, { method: "DELETE" });
      if (onDelete) await onDelete(id);
    } catch (e) {
      console.error("Failed to delete insight", e);
    }
  };

  const getBrandName = (brandId: number) =>
    BRANDS.find((b) => b.id === brandId)?.name ?? `Brand #${brandId}`;

  return (
    <div className={cx(className)}>
      <h1 className={styles.heading}>Insights</h1>
      <div className={styles.list}>
        {insights?.length
          ? (
            insights.map(({ id, text, createdAt, brandId }) => (
              <div className={styles.insight} key={id}>
                <div className={styles["insight-meta"]}>
                  <span>{getBrandName(brandId)}</span>
                  <div className={styles["insight-meta-details"]}>
                    <span>{formatDistanceToNow(new Date(createdAt), { addSuffix: true })}</span>
                    <Trash2Icon
                      className={styles["insight-delete"]}
                      onClick={() => deleteInsight(id)}
                    />
                  </div>
                </div>
                <p className={styles["insight-content"]}>{text}</p>
              </div>
            ))
          )
          : <p>We have no insight!</p>}
      </div>
    </div>
  );
};
