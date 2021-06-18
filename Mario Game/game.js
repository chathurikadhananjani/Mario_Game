
//set the background
kaboom({
    global: true,
    fullscreen:true,
    scale: 1,
    debug: true,
    clearColor: [0, 0, 0, 1],
})

const MOVE_SPEED= 120
const JUMP_SPACE= 360
const BIG_JUMP_FORCE= 550
let CURRENT_JUMP_FORCE=JUMP_SPACE
let isJumping = true
const FALL_DEATH =400


//load images to the ground
loadSprite('coin','img/coin.png')
loadSprite('evil-shroom','img/evil-shroom.png')
loadSprite('brick','img/brick.png')
loadSprite('block','img/block.png')
loadSprite('mario','img/mario.png')
loadSprite('mushroom','img/mushroom.png')
loadSprite('surprise','img/surprise.png')
loadSprite('unboxed','img/unboxed.png')
loadSprite('pipe-top-left','img/pipe-top-left.png')
loadSprite('pipe-top-right','img/pipe-top-right.png')
loadSprite('pipe-bottom-left','img/pipe-bottom-left.png')
loadSprite('pipe-bottom-right','img/pipe-bottom-right.png')

loadSprite('blue-block','img/blue-block.png')
loadSprite('blue-brick','img/blue-brick.png')
loadSprite('blue-steel','img/blue-steel.png')
loadSprite('blue-evil-shroom','img/blue-evil-shroom.png')
loadSprite('blue-surprise','img/blue-surprise.png')


scene("game", ({ level, score }) => {
    layers(['bg','obj','ui'],'obj')

    //map for display the game items
    const maps =[
        [
            '                                                            ',
            '                                                            ',
            '                                                            ',
            '                                                            ',
            '                                                            ',
            '                                                            ',
            '                                                            ',
            '                                                            ',
            '                                                            ',
            '                                                            ',
            '                                                            ',
            '                                                            ',
            '                                                            ',
            '         %       =*=%=                                      ',
            '                                                            ',
            '                                           -+               ',
            '                            ^    ^         ()               ',
            '==============================================   ===========', 
        ],
        [ 
        
        '?                                                          ?',
        '?                                                          ?',
        '?                                                          ?',
        '?                                                          ?',
        '?                                                          ?',
        '?                                                          ?',
        '?                                                          ?',
        '?        %       @@@@@@`                      x x          ?',
        '?                                           x x x          ?',
        '?                                         x x x x  x    -+ ?',
        '?                           z     z     x x x x x  x    () ?',
        '!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!', 
    ],
    [
        '                                                            ',
        '                                                            ',
        '                                                            ',
        '                                                            ',
        '                                                            ',
        '                                                            ',
        '                              %}                            ',
        '                                                       $$$$ ',
        '                                                            ',
        '               ==%%==%%     *==             $$$$$       bbbb',
        '                                                            ',
        '                             ^    ^         bbbbb           ',
        '               bbbbbbbbbbbbbbbbbbbb                         ',
        '                                                      bbb   ',
        '     bbbbbb                                                 ',
        '                                            -+     bb       ',
        '         $$$$$$$$$   ^                      ()               ',
        'bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb', 
    ],
    [ 
            '                                                            ',
            '                                        `          -+       ',
            '                                                   ()       ?',
            '                                                  !!!!!     ?',
            '                                       !!!!!                ?',
            '                                                            ?',
            '                         $$$$$$$$$$$$$ z                    ?',
            '                        =================                   ?',
            '                                                            ?',
            '        %       @@@@@@`                                     ?',
            '!                                                           ?',
            '!                                                           ?',
            '!              z             z     z                        ?',
            '!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!    !!!', 
        ],
    [ 
        
        '=                                                                                             ?',
        '=                                                                                             ?',
        '=                                                                                         -+  ?',
        '=                                                                      $$                 ()  ?',
        '=                                                                     bbb               bbbbbb?',
        '=                                                                                 bb          ?',
        '=                                                      `                                      ?',
        '=        %       @@@@@@`                                             bbbbbbb                  ?',
        '=                                           xx                                                ?',
        '=                                         xxxx       bbbb                                     ?',
        '=    $$$$$$$$$$              z     z     xxxxx                                               z?',
        '===============================================================================================', 
        ],

    ]
    



    //explain about the map
    const levelCfg ={
        width: 20,
        height: 20,
        '=': [sprite('block'), solid()],
        '$': [sprite('coin'),'coin'],
        '%': [sprite('surprise'),solid(), 'coin-surprise'],
        '*': [sprite('surprise'),solid(), 'mushroom-surprise'],
        '}': [sprite('unboxed'), solid()],
        '(': [sprite('pipe-bottom-left'), solid(),scale(0.5)],
        ')': [sprite('pipe-bottom-right'), solid(),scale(0.5)],
        '-': [sprite('pipe-top-left'), solid(),scale(0.5), 'pipe'],
        '+': [sprite('pipe-top-right'), solid(),scale(0.5), 'pipe'],       
        '^': [sprite('evil-shroom'),solid(),'dangerous',body()],
        '#': [sprite('mushroom'),solid(),'mushroom',body()],

        '!': [sprite('blue-block'),solid(),scale(0.5)],
        '?': [sprite('blue-brick'),solid(),scale(0.5)],
        'z': [sprite('blue-evil-shroom'),solid(),scale(0.5),'dangerous'],
        '@': [sprite('blue-surprise'),solid(),scale(0.5),'coin-surprise'],
        '`': [sprite('blue-surprise'),solid(),scale(0.5),'mushroom-surprise'],
        'x': [sprite('blue-steel'),solid(),scale(0.5)],

        'b': [sprite('brick'), solid()],



    }

    const gameLevel=addLevel( maps[level],levelCfg)


    //adding score to the ground
    const scoreLabel=add([
        text(score),
        pos(30,6),
        layer('ui'),
        {
            value: score,
        }
    ])
    add([text('level' + parseInt(level + 1)) ,pos(40,6)])



    //shold happen when mario big
    function big(){
        let timer = 0
        let isBig = false
        return{
            update(){
                if(isBig){
                    CURRENT_JUMP_FORCE=BIG_JUMP_FORCE
                    timer-= dt()
                    if(timer<=0){
                        this.smallify()
                    }
                }
            },
            isBig(){
                return isBig

            },
            //when mario small
            smallify(){
                this.scale=vec2(1),
                CURRENT_JUMP_FORCE=JUMP_SPACE
                timer=0
                isBig=false
            },
            //whwn mario big
            biggify(time){
                this.scale=vec2(2),
                
                timer=time
                isBig=true
            },

        }
    }

    //mario added to the ground
    const player=add([
        sprite('mario'),solid(),
        pos(30,0),
        body(),
        big(),
        origin('bot')
    ])

    //mushroom moves to right
    action('mushroom',(m)=>{
        m.move(20,0)
    })

    //destroy the block and display the coin
    player.on("headbump",(obj)=>{
        if(obj.is('coin-surprise')){
            gameLevel.spawn('$',obj.gridPos.sub(0,1))
            destroy(obj)
            gameLevel.spawn('}',obj.gridPos.sub(0,0))
        }
        if(obj.is('mushroom-surprise')){
            gameLevel.spawn('#',obj.gridPos.sub(0,1))
            destroy(obj)
            gameLevel.spawn('}',obj.gridPos.sub(0,0))
        }
    })

    //when collides mushroom player get bigger
    player.collides('mushroom', (m)=>{
        destroy(m)
        player.biggify(6)
    })

    player.collides('coin',(c)=>{
        destroy(c)
        scoreLabel.value++
        scoreLabel.text = scoreLabel.value

    })


    const ENEMY_SPEED=20
    action('dangerous',(d)=>{
        d.move(-ENEMY_SPEED,0)
    })


    //if mario collides with jump evil will destroy and else mario destroy
    player.collides('dangerous', (d)=>{
        if (isJumping){
            destroy(d)
        }
        else{
            go('lose',{ score: scoreLabel.value})

        }
        
    })
    player.action(()=>{
        camPos(player.pos)
        if(player.pos.y >= FALL_DEATH){
            go('lose',{ score: scoreLabel.value})
        }
    })

    player.action(() =>{

        if(player.grounded()){
            isJumping = false
        }
    })

    player.collides('pipe',()=>{
        keyPress('down',()=>{
            go('game',{
                level: (level + 1) % maps.length,
                score: scoreLabel.value
            })
        })
    })

    

    

    //key events for game play
    keyDown('left',()=>{
        player.move(-MOVE_SPEED,0)
    })

    keyDown('right',()=>{
        player.move(MOVE_SPEED,0)
    })

    keyPress('space',()=>
    {
        if(player.grounded()){
            isJumping = true
            player.jump(CURRENT_JUMP_FORCE)
        }
    })

    //key events ends
    
})


scene('lose', ({ score }) => {
    add([text(score,32), origin('center'), pos(width()/2, height()/2)])
})

 

start("game",{level: 0 ,score: 0})