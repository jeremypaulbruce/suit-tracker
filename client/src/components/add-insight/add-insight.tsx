import { BRANDS } from "../../lib/consts.ts";
import { Button } from "../button/button.tsx";
import { Modal, type ModalProps } from "../modal/modal.tsx";
import styles from "./add-insight.module.css";

type AddInsightProps = ModalProps;

export const AddInsight = (props: AddInsightProps) => {
  const addInsight = () => undefined;

  return (
    <Modal {...props}>
      <h1 className={styles.heading}>Add a new insight</h1>
      <form className={styles.form} onSubmit={addInsight} method="POST">
        <label className={styles.field}>
          <select name="brandId" className={styles["field-input"]}>
            {BRANDS.map(({ id, name }, index) => <option value={id} key={index}>{name}</option>)}
          </select>
        </label>
        <label className={styles.field}>
          Insight
          <textarea
            name="text"
            required
            className={styles["field-input"]}
            rows={5}
            placeholder="Something insightful..."
          />
        </label>
        <Button className={styles.submit} type="submit" label="Add insight" />
      </form>
    </Modal>
  );
};
