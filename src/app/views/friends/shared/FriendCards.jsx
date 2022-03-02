import React, { useEffect, useState } from 'react'
import { Grid, Card, Icon, IconButton, Tooltip, Avatar } from '@mui/material'
import { Box, styled } from '@mui/system'
import { Small } from 'app/components/Typography'

import { getFriends } from 'app/utils/myLeagueAPI'

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

const FriendCards = () => {

 

    let [friendListElements, setElements] = useState([]);

    getFriends().then(friendList => {
        let elementList = []
        friendList.map((friend, index) => {
            let iconUrl = 'https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/profile-icons/' + friend["friendData"]["icon"] + '.jpg'
            elementList.push(
                <Grid item xs={12} md={6} key={friend["friendData"]["puuid"]}>
                    <StyledCard elevation={6}>
                        <ContentBox>
                            <Avatar src={iconUrl} />
                            <Box ml="12px">
                                <Small sx={{ lineHeight: 1 }}>{friend["friendData"]["note"]}</Small>
                                <Heading>{friend["friendData"]["gameName"]}</Heading>
                                <Small sx={{ lineHeight: 1 }}>Other names: {Object.keys(friend["previousNames"]).join(", ")}</Small>
                            </Box>
                        </ContentBox>
                        <Tooltip title="View Details" placement="top">
                            <IconButton>
                                <Icon>arrow_right_alt</Icon>
                            </IconButton>
                        </Tooltip>
                    </StyledCard>
                </Grid>

            )
        })
        friendListElements = elementList;
        setElements(elementList);
        
    })

    return (
        <Grid container spacing={1} sx={{ mb: '24px' }}>
            {friendListElements}
        </Grid>
    )
}

export default FriendCards
