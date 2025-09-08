import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "../ui/badge"

const topClaims = [
    { title: "Study Claims Microwaves Neutralize Food Nutrients", confidence: 98 },
    { title: "Viral Video Shows Sharks Swimming in a City Street", confidence: 95 },
    { title: "Celebrity Endorses 'Miracle' Anti-Aging Water", confidence: 92 },
    { title: "Image of a 'Blue' Moon Over Mountains is Authentic", confidence: 89 },
]

export function TopFalseClaims() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Top False Claims</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
            {topClaims.map((claim, index) => (
                <li key={index} className="flex justify-between items-start gap-4">
                    <span className="text-sm font-medium">{claim.title}</span>
                    <Badge variant="destructive">{claim.confidence}%</Badge>
                </li>
            ))}
        </ul>
      </CardContent>
    </Card>
  )
}
