"use client";
import { useFormStatus } from "react-dom";

export default function CreateCommentBtn() {
    const formStatus = useFormStatus();

    return (
        <button type="submit" disabled={formStatus.pending}>
            {formStatus.pending ? "Creating comment...": "Create comment"}
        </button>
    );
}