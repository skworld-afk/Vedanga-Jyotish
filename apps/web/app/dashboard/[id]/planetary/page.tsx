import { prisma } from "@/src/lib/prisma";
import PlanetaryTable from "@/components/dashboard/PlanetaryTable";

export default async function PlanetaryPage({
params,
}: {
params: Promise<{ id: string }>;
}) {
const { id } = await params;

const profile =
await prisma.profile.findUnique({
where: { id },
include: {
chart: true,
},
});

if (!profile?.chart) {
return <div>No chart found</div>;
}

return (
<PlanetaryTable
planets={
profile.chart.planets as any
}
/>
);
}
