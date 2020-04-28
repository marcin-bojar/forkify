import { elements } from './base';

export const toggleLikeBtn = isLiked => {
    const btnString = isLiked === true ? 'icon-heart' : 'icon-heart-outlined';
    document.querySelector('.recipe__love use').setAttribute('href', `img/icons.svg#${btnString}`);
};

export const toggleLikeMenu = numLikes => {
    elements.likesMenu.style.visibility = numLikes > 0 ? 'visible' : 'hidden';
};

export const renderLike = like => {
    const markup = `
    <li>
        <a class="likes__link" href="#${like.id}">
            <figure class="likes__fig">
                <img src="${like.img}" alt="${like.title}">
            </figure>
            <div class="likes__data">
            <h4 class="likes__name">${like.title}</h4>
            <p class="likes__author">${like.author}</p>
            </div>
        </a>
    </li>  
    `;
    elements.likesList.insertAdjacentHTML('beforeend', markup);
};

export const removeLike = id => {
    const like = document.querySelector(`.likes__link[href="#${id}"]`).parentElement;
    if(like) like.parentElement.removeChild(like);
};