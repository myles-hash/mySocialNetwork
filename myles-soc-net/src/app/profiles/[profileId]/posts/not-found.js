import Link from "next/link";

export default async function NotFound() {
    return (
    <div>
    <h1>UH OH 404</h1>
    <h2>This user profile doesnt exist.. yet</h2>
    <Link href="/profiles">Existing Profiles</Link>
    </div>
    )
}