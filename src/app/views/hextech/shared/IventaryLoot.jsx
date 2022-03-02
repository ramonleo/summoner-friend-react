import React, { useEffect, useState } from 'react'
import { Grid, Card, Icon, IconButton, Tooltip, Avatar } from '@mui/material'
import { Box, styled } from '@mui/system'
import { Small } from 'app/components/Typography'

import { getLoot } from 'app/utils/myLeagueAPI'

const StyledCard = styled(Card)(({ theme }) => ({
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '24px !important',
    background: theme.palette.background.paper,
    [theme.breakpoints.down('sm')]: {
        padding: '16px !important',
    },
}))

const ContentBox = styled('div')(({ theme }) => ({
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    '& small': {
        color: theme.palette.text.secondary,
    },
    '& .icon': {
        opacity: 0.6,
        fontSize: '44px',
        color: theme.palette.primary.main,
    },
}))

const Heading = styled('h6')(({ theme }) => ({
    margin: 0,
    marginTop: '4px',
    fontWeight: '500',
    fontSize: '14px',
    color: theme.palette.primary.main,
}))

const IventaryLoot = () => {

 

    let [lootListElements, setElements] = useState([]);
    //let lootListElements = [];
    getLoot().then(inventory => {
        let elementList = []
        inventory.map((loot, index) => {
            let iconUrl = 'https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/' + loot["tilePath"].replace("/lol-game-data/assets/", "").toLowerCase();
            elementList.push(
                <Grid item xs={12} md={6} key={loot["lootId"]} lootType={loot["type"]}>
                    <Avatar
                    alt={loot["itemDesc"]}
                    src={iconUrl}
                    sx={{ width: 56, height: 56 }}
                    />
                    {loot["itemDesc"] + loot["localizedName"] + " - " +loot["type"]}
                </Grid>                
            )
        })
        lootListElements = elementList;
        setElements(elementList);
        
    })

    return ([
        <Grid container spacing={1} sx={{ mb: '48px' }} key="Material_List">
            {
                lootListElements.filter((item, index) => item["key"].indexOf("MATERIAL_") === 0)
            }
        </Grid>,
        <Grid container spacing={1} sx={{ mb: '48px'}} key="Permanent_Champion_List">
            {
                lootListElements.filter((item, index) => item["key"].indexOf("CHAMPION_") === 0 && item["key"].indexOf("_RENTAL") === -1)
            }
        </Grid>,
        <Grid container spacing={1} sx={{ mb: '48px' }} key="Champion_Token_List">
            {
                lootListElements.filter((item, index) => item["key"].indexOf("CHAMPION_RENTAL_") === 0)
            }
        </Grid>,
        <Grid container spacing={1} sx={{ mb: '48px' }} key="Champion_Skin_Token_List">
            {
                lootListElements.filter((item, index) => item["key"].indexOf("CHAMPION_SKIN_RENTAL_") === 0)
            }
        </Grid>
        ]
    
    )
}

export default IventaryLoot
