import React, { useEffect, useState } from 'react'
import { Grid, Card, Icon, IconButton, Tooltip, Avatar } from '@mui/material'
import { Box, styled } from '@mui/system'
import { Small } from 'app/components/Typography'
import Badge from '@mui/material/Badge';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

import { getLoot, getLootOptions, getLootRecipe, craftLoot } from 'app/utils/myLeagueAPI'

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
    width: '600px',
}))

const ContentBox = styled('div')(({ theme }) => ({
    display: 'flex',
    flexDirection: 'row',
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

const BoxStyle = {
    display: 'inline-flex',
    flexWrap: 'nowrap'
}


const IventaryLoot = () => {
    let modalLootId = {}
    const showLootOptions = (lootId, lootCount) => {
        modalLootId = lootId
        console.log("OPCOES DO LOOT: " + lootId);
        console.log(lootId)
        getLootRecipe(lootId).then(res => {
            console.log("OPTSSSS")
            console.log(res)
            let lootOptElements = []
            res.forEach(opt => {
                if(opt["description"].indexOf("Orbe ") === 0) {
                    //Add button to loopOptElements
                    const textRef = React.createRef();
                    //const [title, setTitle] = useState('')
                    let amount = 0
                    let iconUrl = 'https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/' + opt["imagePath"].replace("/lol-game-data/assets/", "").toLowerCase()
                    lootOptElements.push(
                            <Grid item xs={12} md={6} key={opt["recipeName"]}>
                                <StyledCard elevation={6}>
                                <ContentBox>
                                    <Avatar src={iconUrl} />
                                    <Box ml="12px" sx={BoxStyle}>
                                        <Small sx={{ lineHeight: 1 }}>{opt["slots"][0]["quantity"]}</Small>
                                        <Heading>{opt["description"]}</Heading>
                                        <Small sx={{ lineHeight: 1 }}>{opt["recipeName"]}</Small>
                                    </Box>
                                    <Box ml="12px" sx={BoxStyle}>
                                        <TextField
                                            id="standard-basic"
                                            label="Number"
                                            type="number"
                                            ref={textRef}
                                            onChange={(e) => {
                                                console.log(e.target.value)
                                                amount = e.target.value
                                            }}
                                        />
                                        <Tooltip title="View Details" placement="top">
                                            <IconButton onClick={() => {
                                                console.log("Crafting: " + opt["description"])
                                                console.log("Ammount:" + amount)
                                                console.log("Recipe: " + opt["recipeName"])
                                                console.log("Loot: " + lootId)
                                                for(let i = 0; i < amount; i++) {
                                                    console.log("Craft " + opt["recipeName"] + " " + modalLootId + " number " + (i+1)); 
                                                    craftLoot(opt["recipeName"], JSON.stringify([lootId])).then(res => {
                                                        console.log("CRAFTED!!!!!")
                                                        console.log(res)
                                                        console.log(JSON.stringify(res))
                                                    });
                                                }
                                            }}>
                                                <ShoppingCartIcon />
                                            </IconButton>                                            


                                        </Tooltip>                                        
                                        <Button key={opt["recipeName"]} onClick={() => {
                                            console.log("Crafting: " + opt["description"]) 
                                            console.log(opt)
                                            console.log(modalLootId)

                                            for(let i = 0; i < amount; i++) {
                                                console.log("Craft " + opt["recipeName"] + " " + modalLootId + " number " + i); 
                                                //craftLoot(opt["recipeName"], JSON.stringify([modalLootId]));

                                            }
                                            /*getLoot(modalLootId, opt["recipeDescription"]).then(res => {
                                                console.log("LOOT")
                                                console.log(res)
                                            })*/
                                        }}>{opt["description"] + " X " + Math.floor(lootCount/opt["slots"][0]["quantity"])}
                                        </Button>


                                    </Box>
                                </ContentBox>
                                
                            

                            </StyledCard>
                        </Grid>
                    )
                }
            });
            setLootOptions(lootOptElements)
            setOpen(true)
        })

    }
    
    
    //Modal
    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 700,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
      };
      
    const [open, setOpen] = React.useState(false);
    let [lootOptions, setLootOptions] = useState([])
    const handleClose = () => setOpen(false);  
    

    let [lootListElements, setElements] = useState([]);
    //let lootListElements = [];
    getLoot().then(inventory => {
        let elementList = []
        inventory.map((loot, index) => {
            let iconUrl = 'https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/' + loot["tilePath"].replace("/lol-game-data/assets/", "").toLowerCase();
            elementList.push(
                <Grid item xs={12} md={6} key={loot["lootId"]} loottype={loot["type"]} lootcount={loot["count"]} onClick={(e) => showLootOptions(loot["lootId"], loot["count"])}>
                    
                    <Badge color="secondary" badgeContent={loot["count"]} overlap="circular" max={9999}>
                        <Avatar
                        alt={loot["itemDesc"]}
                        src={iconUrl}
                        sx={{ width: 56, height: 56 }}
                        />
                    </Badge>
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
        </Grid>,
        <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        key="modalLoot"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Loot 
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
          </Typography>
          {lootOptions}
        </Box>
      </Modal>
        ]
    
    )
}

export default IventaryLoot
