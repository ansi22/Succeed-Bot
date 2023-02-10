import dotenv from "dotenv";
dotenv.config();
import Discord from "discord.js";
import fetch from "node-fetch";
const client = new Discord.Client({ intents: ["GUILDS", "GUILD_MESSAGES"] });

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on("message", async (msg) => {
  const resp = msg.content.split(" ");
  if (resp.length !== 2) return;
  const BASE_URL = "https://competitive-coding-api.herokuapp.com/api/";
  var CURR_URL = "";
  var count = 0;
  var chef_count = 0;
  var spoj_count = 0;
  var force_count = 0;
  var bit_count = 0;
  // --------------------------------------------- codechef-count ----------------------------------------- //

  if (resp[0] === "@" || resp[0] === "&") {
    CURR_URL = BASE_URL + "codechef/" + resp[1];
    const response = await fetch(CURR_URL);
    var count_t = await response.json();
    if (count_t.status !== "Failed") {
      chef_count = count_t.fully_solved.count;
      if (resp[0] === "@") {
        msg.reply(
          resp[1] +
            " successfully submitted " +
            chef_count +
            " problems at codechef. "
        );
      }
    } else {
      if (resp[0] === "@")
        msg.reply(
          "OOPS! Invalid  codechef handle, type . command to know more. "
        );
    }
  }
  // --------------------------------------------- spoj-count -------------------------------------------- //

  if (resp[0] === "#" || resp[0] === "&") {
    CURR_URL = BASE_URL + "spoj/" + resp[1];
    const response = await fetch(CURR_URL);
    var count_t = await response.json();
    if (count_t.status !== "Failed") {
      spoj_count = count_t.solved.length;
      if (resp[0] === "#") {
        msg.reply(
          resp[1] +
            " successfully submitted " +
            spoj_count +
            " problems at spoj. "
        );
      }
    } else {
      if (resp[0] === "#")
        msg.reply("OOPS! Invalid spoj handle, type . command to know more.");
    }
  }

  // --------------------------------------------- interviewbit-count ----------------------------------- //

  if (resp[0] === "*" || resp[0] === "&") {
    CURR_URL = BASE_URL + "interviewbit/" + resp[1];
    const response = await fetch(CURR_URL);
    var count_t = await response.json();
    if (count_t.status !== "Failed") {
      bit_count = count_t.score;
      if (resp[0] === "*") {
        msg.reply(
          resp[1] +
            " successfully submitted " +
            bit_count +
            " problems at interviewbit."
        );
      }
    } else {
      if (resp[0] === "*")
        msg.reply(
          "OOPS! Invalid interviewbit handle, type . command to know more."
        );
    }
  }
  // --------------------------------------------- codeforces-count ------------------------------------------- //

  if (resp[0] === "!" || resp[0] === "&") {
    CURR_URL =
      "https://codeforces.com/api/user.status?handle=" +
      resp[1] +
      "&from=1&count=1000";
    const response = await fetch(CURR_URL);
    var count_t = await response.json();
    if (count_t.status !== "Failed") {
      for (var i = 0; i < count_t.result.length; i++) {
        if (count_t.result[i].verdict === "OK") {
          force_count += 1;
        }
      }
      if (resp[0] === "!") {
        msg.reply(
          resp[1] +
            " successfully submitted " +
            force_count +
            " problems at codeforces."
        );
      }
    } else {
      if (resp[0] === "!")
        msg.reply(
          "OOPS! Invalid codeforces handle, type . command to know more."
        );
    }
  }
  // --------------------------------------------- overall-count ------------------------------------------- //

  if (resp[0] === "&") {
    count = chef_count + spoj_count + force_count + bit_count;
    msg.reply(
      resp[1] + " successfully submitted overall " + count + " problems."
    );
  }

  // --------------------------------------------- command ------------------------------------------------ //

  var cmd_msg = "";
  if (resp[0] === "." && resp[1] == "command") {
    cmd_msg +=
      "\nHi there! am here to help you out, follow the commands to get score.\n\n";
    cmd_msg += "For Codechef: @ <codechef_handle_name>\n";
    cmd_msg += "For Codeforces: ! <codeforces_handle_name>\n";
    cmd_msg += "For Spoj: # <spoj_handle_name>\n";
    cmd_msg += "For Interviewbit: * <interviewbit_handle_name>\n\n";
    cmd_msg += "For Overall score: & <handle_name>\n\n";
    msg.reply(cmd_msg);
  }
});

client.login(process.env.TOKEN);
