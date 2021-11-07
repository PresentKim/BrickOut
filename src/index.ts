import "@/styles/index.css";
import Game from "@/game/Game";
import TestGame from "@/game/TestGame";
import "@/utils/matter-js-wrapper"

const games: Game<any>[] = [];

function addGame(game: Game<any>): void {
    game.element.classList.add("app-game")
    document.body.append(game.element);
    games.push(game);
}

document.addEventListener("DOMContentLoaded", async () => {
    addGame(new TestGame());
});