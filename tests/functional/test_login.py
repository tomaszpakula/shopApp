#Test cases: 6  Assertions: 19



def test_login_success(driver):
    driver.get("http://localhost:5173/signin")
    driver.find_element("css selector", '[data-test-id="email"]').send_keys("tomasz@tomasz.pl")
    driver.find_element("css selector", '[data-test-id="password"]').send_keys("123")
    driver.find_element("css selector", '[data-test-id="login-submit"]').click()
    assert "/" in driver.current_url
    assert not driver.find_element("css selector", '[data-test-id="error"]').is_displayed()
    assert driver.find_element("css selector", '[data-test-id="logout"]').is_displayed()

def test_login_failure(driver):
    driver.get("http://localhost:5173/signin")
    driver.find_element("css selector", '[data-test-id="email"]').send_keys("bad@bad.pl")
    driver.find_element("css selector", '[data-test-id="password"]').send_keys("wrong")
    driver.find_element("css selector", '[data-test-id="login-submit"]').click()

    error = driver.find_element("css selector", '[data-test-id="error"]')
    
    assert error is not None
    assert error.is_displayed()
    assert "/signin" in driver.current_url
    assert error.text == "Invalid credentials"

def test_empty_login_form(driver):
    driver.get("http://localhost:5173/signin")
    #only email error
    driver.find_element("css selector", '[data-test-id="login-submit"]').click()
    email_error = driver.find_element("css selector", '[data-test-id="email-error"]')
    try:
        password_error = driver.find_element("css selector", '[data-test-id="password-error"]')
    except:
        password_error = None

    assert email_error.is_displayed()
    assert not password_error
    assert email_error.text == "Email is required"
    
def test_login_form_empty_email(driver):
    driver.get("http://localhost:5173/signin")
    #only email error
    driver.find_element("css selector", '[data-test-id="password"]').send_keys("123")
    driver.find_element("css selector", '[data-test-id="login-submit"]').click()
    email_error = driver.find_element("css selector", '[data-test-id="email-error"]')
    try:
        password_error = driver.find_element("css selector", '[data-test-id="password-error"]')
    except:
        password_error = None

    assert email_error.is_displayed()
    assert not password_error
    assert email_error.text == "Email is required"

def test_login_form_empty_password(driver):
    driver.get("http://localhost:5173/signin")
    #only password error
    driver.find_element("css selector", '[data-test-id="email"]').send_keys("email@email.pl")
    driver.find_element("css selector", '[data-test-id="login-submit"]').click()
    password_error = driver.find_element("css selector", '[data-test-id="password-error"]')
    try:
        email_error = driver.find_element("css selector", '[data-test-id="email-error"]')
    except:
        email_error = None
    assert password_error.is_displayed()
    assert not email_error
    assert password_error.text == "Password is required"

def test_login_form_invalid_email(driver):
    driver.get("http://localhost:5173/signin")
    #invalid email error
    driver.find_element("css selector", '[data-test-id="email"]').send_keys("invalid-email")
    driver.find_element("css selector", '[data-test-id="password"]').send_keys("123")
    driver.find_element("css selector", '[data-test-id="login-submit"]').click()
    
    email_error = driver.find_element("css selector", '[data-test-id="email-error"]')
    try:
        password_error = driver.find_element("css selector", '[data-test-id="password-error"]')
    except:
        password_error = None
    
    assert email_error.is_displayed()
    assert not password_error
    assert email_error.text == "Invalid email address"

