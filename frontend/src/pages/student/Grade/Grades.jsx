import { useState } from "react";


export default function Grades() {
    const [loading, setLoading] = useState(false)

    if (loading) {
        return (
            <div className="w-full h-screen flex items-center justify-center">
                <CircleLoader fullScreen={false} />
            </div>
        );
    }
    
    return (
        <>
            <h1>Grades list</h1>
        </>
    )
}