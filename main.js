const apiUrl = "https://6823484465ba058033961816.mockapi.io";
const imageUrl = document.getElementById("imageUrl");
const postText = document.getElementById("postText");
const button = document.getElementById("submit");

const u = localStorage.getItem("username");

button.addEventListener("click", async (e) => {
  const response = await fetch(`${apiUrl}/post`, {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify({
      imageUrl: imageUrl.value,
      text: postText.value,
      comment: [],
      author: u, 
    }),
  });

  getPosts();
  
  // Utility function for confirmation dialogs
  function confirmAction(message, callback) {
    if (confirm(message)) {
      callback();
    }
  }
});

async function getPosts() {
  const res = await fetch(`${apiUrl}/post`);
  const posts = await res.json();
  displayPosts(posts);
}


function displayPosts(posts) {
  const container = document.getElementById("posts-container");
  container.className = "d-flex flex-wrap justify-content-center align-items-center ";
  container.innerHTML = "";

  // Use the globally declared 'u' variable

  posts.forEach((item) => {
    const card = document.createElement("div");
    card.className = "card d-flex flex-column align-items-center justify-content-center my-auto shadow-sm rounded py-5";

    const img = document.createElement("img");
    img.src = item.imageUrl;
    img.style.width = "50%";

    const title = document.createElement("h4");
    title.innerText = item.text;

    card.appendChild(img);
    card.appendChild(title);

    const commentsDiv = document.createElement("div");
    commentsDiv.className = "mt-3 w-100 px-4";

    if (Array.isArray(item.comments) && item.comments.length > 0) {
      item.comments.forEach((c, index) => {
        const commentEl = document.createElement("div");
        commentEl.className = "d-flex justify-content-between align-items-center border p-1 mb-2";

        const text = document.createElement("p");
        text.className = "mb-0";
        text.innerText = ` ${c.user}: ${c.text}`;
        commentEl.appendChild(text);

        if (u === c.user) {
          const deleteCommentBtn = document.createElement("button");
          deleteCommentBtn.innerText = "Delete";
          deleteCommentBtn.className = "btn btn-danger btn-sm m-1";

          deleteCommentBtn.addEventListener("click", async () => {
            const updatedComments = item.comments.filter((_, i) => i !== index);
        confirmAction("Are you sure you want to delete your comment?", async () => {
            await fetch(`${apiUrl}/post/${item.id}`, {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                ...item,
                comments: updatedComments
              }),
            });
            getPosts();
        });
            getPosts(); 
          });

          commentEl.appendChild(deleteCommentBtn);
        }

        commentsDiv.appendChild(commentEl);
      });
    } else {
      const noComment = document.createElement("p");
      noComment.innerText = "No comments yet.";
      noComment.className = "text-muted  text-center";
      commentsDiv.appendChild(noComment);
    }

    card.appendChild(commentsDiv);

    if (u) {
      const commentOutput = document.createElement("div");
      commentOutput.className = "input-group mt-2 px-4 ";

      const commentInput = document.createElement("input");
      commentInput.type = "text";
      commentInput.className = "form-control form-control-sm py-2";
      commentInput.placeholder = "Add a your thoughts...";

      const sendBtn = document.createElement("button");
      sendBtn.className = "btn text-white btn-sm ";
      sendBtn.style.backgroundColor = "#8f94fb";
      sendBtn.innerText = "Send";

      sendBtn.addEventListener("click", async () => {
        const commentText = commentInput.value.trim();
        if (!commentText) return;

        const newComment = { user: u, text: commentText };

        const updatedPost = {
          ...item,
          comments: [...(item.comments || []), newComment],
        };

        await fetch(`${apiUrl}/post/${item.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedPost),
        });

        getPosts(); 
      });

      commentOutput.appendChild(commentInput);
      commentOutput.appendChild(sendBtn);
      card.appendChild(commentOutput);
    }


    if (item.author === u) {
      const deleteBtn = document.createElement("button");
      deleteBtn.innerText = "Delete Post";
      deleteBtn.className = "btn btn-danger btn-sm mt-3";
      deleteBtn.addEventListener("click", async () => {
        if (confirm("Are you sure you want to delete this post?")) {
          await fetch(`${apiUrl}/post/${item.id}`, {
            method: "DELETE",
          });
          getPosts();
        }
      });
      card.appendChild(deleteBtn);
    }

    container.appendChild(card);
  });
}
getPosts();
