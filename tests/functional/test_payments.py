#Testcase: 8    Arsercje: 23
import pytest
from selenium.webdriver.common.by import By

@pytest.fixture(autouse=True)
def payment_page_setup(driver):

    driver.get("http://localhost:5173/")

    first_product = driver.find_elements(By.CSS_SELECTOR, "[data-testid='product']")[0]

    increase_btn = first_product.find_element(By.CSS_SELECTOR, "[data-testid='increase']")
    increase_btn.click()
    add_to_cart_btn = first_product.find_element(By.CSS_SELECTOR, "[data-testid='add-to-cart']")
    add_to_cart_btn.click()

    cart_icon = driver.find_element(By.CSS_SELECTOR, "[data-testid='cart-icon']")
    cart_icon.click()
    pay_btn = driver.find_element(By.CSS_SELECTOR, "[data-testid='pay-button']")
    pay_btn.click()



def test_endpoint_should_be_payment(driver):
    assert "/payment" in driver.current_url


def test_invalid_card_number_does_not_pay(driver):
    card_holder = driver.find_element(By.CSS_SELECTOR, "[data-testid='card-holder']")
    exp_date = driver.find_element(By.CSS_SELECTOR, "[data-testid='exp-date']")
    cvv = driver.find_element(By.CSS_SELECTOR, "[data-testid='cvv']")
    final_pay_btn = driver.find_element(By.CSS_SELECTOR, "[data-testid='final-pay-button']")

    card_holder.send_keys("tomasz")
    exp_date.send_keys("21/24")
    cvv.send_keys("012")
    final_pay_btn.click()

    assert "/payment" in driver.current_url
    payment_msg = driver.find_element(By.CSS_SELECTOR, "[data-testid='payment-msg']")
    assert payment_msg.text == "Card number must be exactly 4 digits."

    card_number = driver.find_element(By.CSS_SELECTOR, "[data-testid='card-number']")
    card_number.send_keys("44")
    final_pay_btn.click()

    assert "/payment" in driver.current_url
    payment_msg = driver.find_element(By.CSS_SELECTOR, "[data-testid='payment-msg']")
    assert payment_msg.text == "Card number must be exactly 4 digits."


def test_invalid_card_holder_does_not_pay(driver):
    card_number = driver.find_element(By.CSS_SELECTOR, "[data-testid='card-number']")
    exp_date = driver.find_element(By.CSS_SELECTOR, "[data-testid='exp-date']")
    cvv = driver.find_element(By.CSS_SELECTOR, "[data-testid='cvv']")
    final_pay_btn = driver.find_element(By.CSS_SELECTOR, "[data-testid='final-pay-button']")

    card_number.send_keys("4444")
    exp_date.send_keys("21/24")
    cvv.send_keys("012")
    final_pay_btn.click()

    assert "/payment" in driver.current_url
    payment_msg = driver.find_element(By.CSS_SELECTOR, "[data-testid='payment-msg']")
    assert payment_msg.text == "Card holder name is too short."


    card_holder = driver.find_element(By.CSS_SELECTOR, "[data-testid='card-holder']")
    card_holder.send_keys("t")
    final_pay_btn.click()

    assert "/payment" in driver.current_url
    payment_msg = driver.find_element(By.CSS_SELECTOR, "[data-testid='payment-msg']")
    assert payment_msg.text == "Card holder name is too short."


def test_invalid_expiration_date_does_not_pay(driver):
    card_number = driver.find_element(By.CSS_SELECTOR, "[data-testid='card-number']")
    card_holder = driver.find_element(By.CSS_SELECTOR, "[data-testid='card-holder']")
    cvv = driver.find_element(By.CSS_SELECTOR, "[data-testid='cvv']")
    final_pay_btn = driver.find_element(By.CSS_SELECTOR, "[data-testid='final-pay-button']")

    card_number.send_keys("4444")
    card_holder.send_keys("tomasz")
    cvv.send_keys("012")
    final_pay_btn.click()

    assert "/payment" in driver.current_url
    payment_msg = driver.find_element(By.CSS_SELECTOR, "[data-testid='payment-msg']")
    assert payment_msg.text == "Expiration date must be in format MM/YY."

    exp_date = driver.find_element(By.CSS_SELECTOR, "[data-testid='exp-date']")
    exp_date.send_keys("2124")
    final_pay_btn.click()

    assert "/payment" in driver.current_url
    payment_msg = driver.find_element(By.CSS_SELECTOR, "[data-testid='payment-msg']")
    assert payment_msg.text == "Expiration date must be in format MM/YY."


def test_invalid_cvv_does_not_pay(driver):
    card_number = driver.find_element(By.CSS_SELECTOR, "[data-testid='card-number']")
    card_holder = driver.find_element(By.CSS_SELECTOR, "[data-testid='card-holder']")
    exp_date = driver.find_element(By.CSS_SELECTOR, "[data-testid='exp-date']")
    final_pay_btn = driver.find_element(By.CSS_SELECTOR, "[data-testid='final-pay-button']")

    card_number.send_keys("4444")
    card_holder.send_keys("tomasz")
    exp_date.send_keys("21/24")
    final_pay_btn.click()

    assert "/payment" in driver.current_url
    payment_msg = driver.find_element(By.CSS_SELECTOR, "[data-testid='payment-msg']")
    assert payment_msg.text == "CVV must be exactly 3 digits."

    cvv = driver.find_element(By.CSS_SELECTOR, "[data-testid='cvv']")
    cvv.send_keys("01")
    final_pay_btn.click()

    assert "/payment" in driver.current_url
    payment_msg = driver.find_element(By.CSS_SELECTOR, "[data-testid='payment-msg']")
    assert payment_msg.text == "CVV must be exactly 3 digits."


def test_all_valid_data_then_pay(driver):

    card_number = driver.find_element(By.CSS_SELECTOR, "[data-testid='card-number']")
    card_holder = driver.find_element(By.CSS_SELECTOR, "[data-testid='card-holder']")
    exp_date = driver.find_element(By.CSS_SELECTOR, "[data-testid='exp-date']")
    cvv = driver.find_element(By.CSS_SELECTOR, "[data-testid='cvv']")
    final_pay_btn = driver.find_element(By.CSS_SELECTOR, "[data-testid='final-pay-button']")

    card_number.send_keys("4444")
    card_holder.send_keys("tomasz")
    exp_date.send_keys("21/24")
    cvv.send_keys("012")
    final_pay_btn.click()

    assert "/message" in driver.current_url

    success_msg = driver.find_element(By.CSS_SELECTOR, "[data-testid='payment-message']")
    assert success_msg.is_displayed()
    assert success_msg.text == "Payment successful!"


def test_back_to_shop_button_works(driver):
    card_number = driver.find_element(By.CSS_SELECTOR, "[data-testid='card-number']")
    card_holder = driver.find_element(By.CSS_SELECTOR, "[data-testid='card-holder']")
    exp_date = driver.find_element(By.CSS_SELECTOR, "[data-testid='exp-date']")
    cvv = driver.find_element(By.CSS_SELECTOR, "[data-testid='cvv']")
    final_pay_btn = driver.find_element(By.CSS_SELECTOR, "[data-testid='final-pay-button']")

    card_number.send_keys("4444")
    card_holder.send_keys("tomasz")
    exp_date.send_keys("21/24")
    cvv.send_keys("012")
    final_pay_btn.click()

    back_to_shop = driver.find_element(By.CSS_SELECTOR, "[data-testid='back-to-shop']")
    back_to_shop.click()
    assert "/" in driver.current_url


def test_cart_empty_after_payment(driver):

    card_number = driver.find_element(By.CSS_SELECTOR, "[data-testid='card-number']")
    card_holder = driver.find_element(By.CSS_SELECTOR, "[data-testid='card-holder']")
    exp_date = driver.find_element(By.CSS_SELECTOR, "[data-testid='exp-date']")
    cvv = driver.find_element(By.CSS_SELECTOR, "[data-testid='cvv']")
    final_pay_btn = driver.find_element(By.CSS_SELECTOR, "[data-testid='final-pay-button']")

    card_number.send_keys("4444")
    card_holder.send_keys("tomasz")
    exp_date.send_keys("21/24")
    cvv.send_keys("012")
    final_pay_btn.click()

    back_to_shop = driver.find_element(By.CSS_SELECTOR, "[data-testid='back-to-shop']")
    back_to_shop.click()


    cart_icon = driver.find_element(By.CSS_SELECTOR, "[data-testid='cart-icon']")
    cart_icon.click()
    products = driver.find_elements(By.CSS_SELECTOR, "[data-testid='product']")
    assert len(products) == 0


def direct_visit_message_without_payment(driver):
    driver.get("http://localhost:5173/message")
    payment_message = driver.find_element(By.CSS_SELECTOR, "[data-testid='payment-message']")
    assert payment_message.text == "Something went wrong ..."