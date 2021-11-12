import TestGame from "@/game/TestGame";
import "@/styles/index.css";
import "@/matterjs";
import "@/utils/CanvasRenderingContext2D";

document.addEventListener("DOMContentLoaded", async () => {
    const game = new TestGame();
    game.element.classList.add("app-game")
    document.body.append(game.element);
});