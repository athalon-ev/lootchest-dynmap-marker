// deno run -allow-read=data.yml ./index.ts > markers.yml
import { parse, stringify } from 'https://deno.land/std@0.106.0/encoding/yaml.ts'

interface LootchestUnparsed {
    position: {
        world: string
        x: number
        y: number
        z: number
    }
}

interface Lootchest extends LootchestUnparsed {
    name: string
}

const createMarkerFromLootchest = (lootchest: Lootchest) => ({
    ...lootchest.position,
    icon: 'chest',
    markup: false,
    label: lootchest.name
})

const parseLootchests = (lootchestsYml: string) => {
    const lootchests = parse(lootchestsYml) as { chests: Record<string, LootchestUnparsed> }
    const lootchestsLabelled = Object.entries(lootchests.chests).map(l => ({
        name: l[0],
        ...l[1]
    }))
    const markers = Object.fromEntries(
        lootchestsLabelled
            .filter(m => m.position.world == 'Westwindinseln')
            .map(createMarkerFromLootchest).map(m => [m.label, m])
    )
    return stringify({ sets: markers })

}

const lootchestsYml = await Deno.readTextFile('./data.yml')
console.log(parseLootchests(lootchestsYml))
