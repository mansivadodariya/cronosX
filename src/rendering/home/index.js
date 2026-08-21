import React from 'react'
import Herobanner from './herobanner'
import Platform from './platform'
import AiAssistant from './aiAssistant'
import GlobalNetworkMap from './globalNetworkMap'
import HowitWorks from './howitWorks'
import ChartAnalysis from './chartAnalysis'
import TeamUp from './teamUp'
import Testimonials from './testimonials'
import ReadytoPut from './readytoPut'
import CardList from './cardList'

export default function HomePage() {
    return (
        <div>
            <Herobanner />
            <CardList />
            <Platform />
            <AiAssistant />
            <HowitWorks />
            <ChartAnalysis />
            <TeamUp />
            <Testimonials />
            <GlobalNetworkMap />
            <ReadytoPut />
        </div>
    )
}
