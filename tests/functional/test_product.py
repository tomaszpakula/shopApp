#Testcase: 11 Asercje: 24

from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import pytest
from time import sleep

BASE_URL = "http://localhost:5173"

@pytest.fixture(autouse=True)
def setup(driver):
    driver.get(BASE_URL)

def test_add_to_cart_button_exists(driver):
    products = driver.find_elements(By.CSS_SELECTOR, '[data-testid="product"]')
    for product in products:
        add_button = product.find_element(By.CSS_SELECTOR, '[data-testid="add-to-cart"]')
        assert add_button.is_displayed()
        assert add_button.get_attribute("data-icon") == "cart-shopping"

def test_increase_product_quantity(driver):
    products = driver.find_elements(By.CSS_SELECTOR, '[data-testid="product"]')
    for product in products:
        inc = product.find_element(By.CSS_SELECTOR, '[data-testid="increase"]')
        qty = product.find_element(By.CSS_SELECTOR, '[data-testid="quantity"]')
        assert qty.text == "0"
        inc.click()
        assert qty.text == "1"

def test_decrease_product_quantity(driver):
    products = driver.find_elements(By.CSS_SELECTOR, '[data-testid="product"]')
    for product in products:
        dec = product.find_element(By.CSS_SELECTOR, '[data-testid="decrease"]')
        assert not dec.is_enabled()
        product.find_element(By.CSS_SELECTOR, '[data-testid="increase"]').click()
        product.find_element(By.CSS_SELECTOR, '[data-testid="increase"]').click()
        dec.click()
        qty = product.find_element(By.CSS_SELECTOR, '[data-testid="quantity"]')
        assert qty.text == "1"

def test_add_to_cart_resets_counter(driver):
    products = driver.find_elements(By.CSS_SELECTOR, '[data-testid="product"]')
    for product in products:
        inc = product.find_element(By.CSS_SELECTOR, '[data-testid="increase"]')
        inc.click()
        inc.click()
        product.find_element(By.CSS_SELECTOR, '[data-testid="add-to-cart"]').click()
        qty = product.find_element(By.CSS_SELECTOR, '[data-testid="quantity"]')
        assert qty.text == "0"

def test_cart_icon_navigation(driver):
    cart_icon = driver.find_element(By.CSS_SELECTOR, '[data-testid="cart-icon"]')
    cart_icon.click()
    sleep(10)
    assert "/cart" in driver.current_url
    cart_icon = driver.find_element(By.CSS_SELECTOR, '[data-testid="cart-icon"]')
    cart_icon.click()
    assert "/" in driver.current_url

def test_cart_items_and_buttons_exist(driver):
    driver.find_element(By.CSS_SELECTOR, '[data-testid="cart-icon"]').click()
    assert driver.find_element(By.CSS_SELECTOR, '[data-testid="cart-item"],[data-testid="empty-cart-msg"]')
    assert driver.find_element(By.CSS_SELECTOR, '[data-testid="clear-cart-button"]')
    assert driver.find_element(By.CSS_SELECTOR, '[data-testid="pay-button"]')

def test_clear_cart_displays_message(driver):
    product = driver.find_elements(By.CSS_SELECTOR, '[data-testid="product"]')[0]
    product.find_element(By.CSS_SELECTOR, '[data-testid="increase"]').click()
    product.find_element(By.CSS_SELECTOR, '[data-testid="add-to-cart"]').click()
    driver.find_element(By.CSS_SELECTOR, '[data-testid="cart-icon"]').click()
    driver.find_element(By.CSS_SELECTOR, '[data-testid="clear-cart-button"]').click()
    assert driver.find_element(By.CSS_SELECTOR, '[data-testid="empty-cart-msg"]')
    assert driver.find_element(By.CSS_SELECTOR, '[data-testid="clear-cart-button"]')
    assert driver.find_element(By.CSS_SELECTOR, '[data-testid="pay-button"]')

def test_remove_item_from_cart(driver):
    product = driver.find_elements(By.CSS_SELECTOR, '[data-testid="product"]')[0]
    product.find_element(By.CSS_SELECTOR, '[data-testid="increase"]').click()
    product.find_element(By.CSS_SELECTOR, '[data-testid="add-to-cart"]').click()
    driver.find_element(By.CSS_SELECTOR, '[data-testid="cart-icon"]').click()
    cart_item = driver.find_element(By.CSS_SELECTOR, '[data-testid="cart-item"]')
    cart_item.find_element(By.CSS_SELECTOR, '[data-testid="remove-item"]').click()
    WebDriverWait(driver, 5).until(EC.invisibility_of_element(cart_item))

def test_buttons_disabled_when_cart_empty(driver):
    driver.find_element(By.CSS_SELECTOR, '[data-testid="cart-icon"]').click()
    btn = driver.find_element(By.CSS_SELECTOR, '[data-testid="clear-cart-button"]')
    if btn.is_enabled():
        assert not driver.find_elements(By.CSS_SELECTOR, '[data-testid="empty-cart-msg"]')
        btn.click()
        assert driver.find_element(By.CSS_SELECTOR, '[data-testid="empty-cart-msg"]')
        assert not driver.find_elements(By.CSS_SELECTOR, '[data-testid="product"]')
        assert not btn.is_enabled()
    else:
        assert driver.find_element(By.CSS_SELECTOR, '[data-testid="empty-cart-msg"]')
        assert not btn.is_enabled()

def test_products_displayed_message_not(driver):
    product = driver.find_elements(By.CSS_SELECTOR, '[data-testid="product"]')[0]
    product.find_element(By.CSS_SELECTOR, '[data-testid="increase"]').click()
    product.find_element(By.CSS_SELECTOR, '[data-testid="add-to-cart"]').click()
    driver.find_element(By.CSS_SELECTOR, '[data-testid="cart-icon"]').click()
    assert driver.find_element(By.CSS_SELECTOR, '[data-testid="cart-item"]')
    assert not driver.find_elements(By.CSS_SELECTOR, '[data-testid="empty-cart-msg"]')

def test_message_displayed_products_not(driver):
    driver.find_element(By.CSS_SELECTOR, '[data-testid="cart-icon"]').click()
    btn = driver.find_element(By.CSS_SELECTOR, '[data-testid="clear-cart-button"]')
    if btn.is_enabled():
        btn.click()
    sleep(1)
    assert not driver.find_elements(By.CSS_SELECTOR, '[data-testid="cart-item"]')
    assert driver.find_element(By.CSS_SELECTOR, '[data-testid="empty-cart-msg"]')
