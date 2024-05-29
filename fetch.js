async function fetchItemShop() {
    try {
        const response = await fetch('https://fortnite-api.com/v2/shop/br');
        const data = await response.json();
        const featuredItems = data?.data?.featured?.entries || [];
        displayItemShop(removeDuplicates(featuredItems));
        return featuredItems;
    } catch (error) {
        document.getElementById('itemShop').textContent = 'Failed to load item shop';
        console.error('Error fetching item shop:', error);
    }
}

function removeDuplicates(items) {
    const seenNames = new Set();
    const uniqueItems = [];
    items.forEach(item => {
        const itemName = item.bundle ? item.bundle.name : item.items[0].name;
        if (!seenNames.has(itemName)) {
            seenNames.add(itemName);
            uniqueItems.push(item);
        }
    });
    return uniqueItems;
}

function displayItemShop(items) {
    const itemShopContainer = document.getElementById('itemShop');
    itemShopContainer.innerHTML = '';

    if (items.length === 0) {
        itemShopContainer.textContent = 'No items available';
        return;
    }

    items.forEach(item => {
        const itemElement = document.createElement('div');
        const rarityClass = `rarity-${item.items[0].rarity.value.toLowerCase()}`;
        itemElement.classList.add('item', rarityClass);

        const itemName = document.createElement('h2');
        itemName.textContent = item.bundle ? item.bundle.name : item.items[0].name;

        const itemType = document.createElement('p');
        itemType.textContent = `Type: ${item.bundle ? 'Bundle' : item.items[0].type.value}`;

        const itemDescription = document.createElement('p');
        itemDescription.textContent = item.items[0].description || 'No description available';

        const itemPrice = document.createElement('p');
        itemPrice.classList.add('itemPrice');
        itemPrice.textContent = `Price: ${item.finalPrice} V-Bucks`;

        itemElement.appendChild(itemName);
        itemElement.appendChild(itemType);
        itemElement.appendChild(itemDescription);
        itemElement.appendChild(itemPrice);

        if (item.bundle) {
            const bundleContents = document.createElement('div');
            bundleContents.innerHTML = '<strong>Bundle Contents:</strong>';
            item.items.forEach(subItem => {
                const subItemElement = document.createElement('p');
                subItemElement.textContent = `${subItem.name} (Type: ${subItem.type.value})`;
                bundleContents.appendChild(subItemElement);
            });
            itemElement.appendChild(bundleContents);
        }

        itemShopContainer.appendChild(itemElement);
    });
}

function searchItems(items, query) {
    const lowerCaseQuery = query.toLowerCase();
    const filteredItems = items.filter(item => 
        item.bundle ? 
        item.bundle.name.toLowerCase().includes(lowerCaseQuery) :
        item.items.some(subItem => subItem.name.toLowerCase().includes(lowerCaseQuery))
    );
    displayItemShop(removeDuplicates(filteredItems));
}

document.getElementById('searchButton').addEventListener('click', () => {
    const query = document.getElementById('searchInput').value;
    fetchItemShop().then(items => searchItems(items, query));
});

fetchItemShop();