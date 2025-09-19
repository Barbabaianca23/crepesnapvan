import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()


async function main() {
await prisma.menuItem.createMany({ data: [
{ name: 'Crepe Nutella', description: 'Classica e irresistibile', priceCents: 450, category: 'dolci' },
{ name: 'Crepe Fragole & Panna', description: 'Fresca e golosa', priceCents: 550, category: 'dolci' },
{ name: 'Crepe Prosciutto & Formaggio', description: 'Salata croccante', priceCents: 600, category: 'salate' },
{ name: 'Tè Freddo', description: 'Pesca o limone', priceCents: 250, category: 'bevande' },
]})


await prisma.event.create({ data: {
title: 'Street Food Festival',
city: 'Bologna',
date: new Date(Date.now() + 1000*60*60*24*14),
address: 'Piazza Maggiore'
}})
}


main().finally(() => prisma.$disconnect())