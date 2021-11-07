import "@/styles/index.css";
import Game from "@/game/Game";
import "@/matterjs"
import TestGame from "@/game/TestGame";

const games: Game<any>[] = [];

function addGame(game: Game<any>): void {
    game.element.classList.add("app-game")
    document.body.append(game.element);
    games.push(game);
}

document.addEventListener("DOMContentLoaded", async () => {
    addGame(new TestGame());
});