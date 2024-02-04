"use client";
import { useFormStatus } from "react-dom";

export default function CreatePostBtn() {
    const formStatus = useFormStatus();

    return (
        <button type="submit" disabled={formStatus.pending}>
            {formStatus.pending ? "Creating post...": "Create post"}
        </button>
    );
}