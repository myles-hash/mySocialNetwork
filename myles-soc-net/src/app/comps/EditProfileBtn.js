"use client";
import { useFormStatus } from "react-dom";

export default function EditProfileBtn() {
    const formStatus = useFormStatus();

    return (
        <button type="submit" disabled={formStatus.pending}>
            {formStatus.pending ? "Editing profile...": "Edit profile"}
        </button>
    );
}