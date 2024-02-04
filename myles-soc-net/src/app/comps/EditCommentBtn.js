"use client";
import { useFormStatus } from "react-dom";

export default function EditCommentBtn() {
    const formStatus = useFormStatus();

    return (
        <button type="submit" disabled={formStatus.pending}>
            {formStatus.pending ? "Editing comment...": "Edit comment"}
        </button>
    );
}