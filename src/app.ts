import { CanvasManagerFactory } from "./manager/canvas.manager.js";
import { Entity } from "./obj/entity.core.js";
import { GravityEntity } from "./obj/gravity.js";
import { between } from "./util/Math.util.js";
import { QuadTree } from "./util/quadtree.js";
import { Vector2D } from "./util/vector2D.js";

const canvasManager = CanvasManagerFactory('canvas');

const BALL_R = 20;

function init() {
    canvasManager.resize();
    const vw = canvasManager.vw - 1000;

    const camera = {
        x: vw / 2,
        y: canvasManager.vh / 2,
        width: 1000,
        height: 1000,
        velocity: new Vector2D(
            5,
            5
        ),
    }

    const entityManager = new QuadTree<Entity>({
        w: vw,
        h: canvasManager.vh,
        split: 5,
    });


    const position = new Vector2D(vw / 2, canvasManager.vh / 2);
    const G = new GravityEntity(position, 1000, 1, canvasManager);

    for (let i = 0; i < 1000; i++) {
        const x = (Math.floor(Math.random() * vw));
        const y = (Math.floor(Math.random() * canvasManager.vh));

        const vx = (Math.floor(Math.random() * 40) - 20) || 1;
        const vy = (Math.floor(Math.random() * 40) - 20) || 1;
        entityManager.add(new Entity({
            position: new Vector2D(x, y),
            velocity: new Vector2D(vx, vy),
            acceleration: new Vector2D(0, 0),
            color: `rgb(${255 * Math.random()},${255 * Math.random()},${255 * Math.random()})`,
        }));
    }

    let prevTime = 0;
    function draw(time = 0) {
        canvasManager.draw((ctx, vw, vh) => {
            ctx.clearRect(0, 0, canvasManager.vw, vh);
        });

        entityManager.fullItems().forEach(entity => {
            entityManager.get(entity.x, entity.y).forEach(entity2 => {
                const sub = entity.position.clone().sub(entity2.position).size;
                if (entity != entity2 && sub < (BALL_R * 2)) {
                    let origin = entity.velocity.clone();
                    let speed1 = entity.velocity.size;
                    let speed2 = entity2.velocity.size;

                    entity.velocity.mul(-1).add(entity2.velocity).normalize(speed1);
                    entity2.velocity.mul(-1).add(origin).normalize(speed2);

                    entity.position.add(entity.velocity.clone().normalize((BALL_R * 2) - sub));
                    entity2.position.add(entity2.velocity.clone().normalize((BALL_R * 2) - sub));
                }
            })

            const speed = entity.velocity.size;
            entity.velocity.add(entity.acceleration).normalize(speed);
            entity.position.add(entity.velocity.clone().mul(time - prevTime).avg(16));

            if (entity.position.x < BALL_R) {
                entity.position.x = BALL_R;
                entity.velocity.mul(-1, 1);
            }
            if (entity.position.x > vw - BALL_R) {
                entity.position.x = vw - BALL_R;
                entity.velocity.mul(-1, 1);
            }
            if (entity.position.y < BALL_R) {
                entity.position.y = BALL_R;
                entity.velocity.mul(1, -1);
            }
            if (entity.position.y > canvasManager.vh - BALL_R) {
                entity.position.y = canvasManager.vh - BALL_R;
                entity.velocity.mul(1, -1);
            }


            if (entity.position.clone().sub(G.position).size < G.r) {
                const origin = entity.velocity.clone();
                G.effect(entity);
                entity.acceleration = origin.sub(entity.velocity).mul(-1);
            }
            entity.acceleration.mul(0.9);

            if (between(camera.x - camera.width / 2, camera.x + camera.width / 2)(entity.x) && between(camera.y - camera.height / 2, camera.y + camera.height / 2)(entity.y)) {
                canvasManager.draw((ctx, vw, vh) => {
                    ctx.beginPath();
                    ctx.arc(entity.position.x - (camera.x - camera.width/2) + 3180, entity.position.y - (camera.y - camera.height/2)+ 1000, BALL_R, 0, Math.PI * 2);
                    ctx.fillStyle = entity.color;
                    ctx.fill();
                    ctx.closePath();
                });
            }
            canvasManager.draw((ctx, vw, vh) => {
                ctx.beginPath();
                ctx.arc(entity.position.x, entity.position.y, BALL_R, 0, Math.PI * 2);
                ctx.fillStyle = entity.color;
                ctx.fill();
                ctx.closePath();
            });
        });

        G.draw(Math.floor(time));
        canvasManager.draw((ctx) => {
            entityManager.draw(ctx);
        });

        const items = entityManager.fullItems();
        entityManager.clear();
        entityManager.add(items);

        canvasManager.draw((ctx, vw, vh) => {
            ctx.beginPath();
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillStyle = '#000';
            ctx.fillText(((time - prevTime)).toFixed(2), vw - 500, 200);
            ctx.font = '100px Arial';
            ctx.fill();
            ctx.closePath();
        });
        camera.x += camera.velocity.x;
        camera.y += camera.velocity.y;
        if(camera.x + camera.width/2 > vw || camera.x < camera.width/2) {
            camera.velocity.x *= -1;
        }
        if(camera.y + camera.height/2 > canvasManager.vh || camera.y < camera.height/2) {
            camera.velocity.y *= -1;
        }
        canvasManager.draw((ctx)=>{
            ctx.beginPath();
            ctx.strokeStyle = '#000'
            ctx.lineWidth = 10;
            ctx.rect(camera.x - camera.width/2, camera.y - camera.height/2, camera.width, camera.height);
            ctx.stroke();
            ctx.closePath();

            ctx.beginPath();
            ctx.strokeStyle = '#000'
            ctx.lineWidth = 10;
            ctx.rect(3180, 1000, camera.width, camera.height);
            ctx.stroke();
            ctx.closePath();
        })
        prevTime = time;
        requestAnimationFrame(draw);
    }
    draw();

    initEvents();
}


function initEvents() {
    document.addEventListener('resize', function () {
        canvasManager.resize()
    });
}

init();
