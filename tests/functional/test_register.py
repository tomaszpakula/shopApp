#asercje: 51 testcase: 7

from time import sleep
import uuid
import pytest

def test_register_success(driver):
    user = f"user-{uuid.uuid4().hex[:8]}@test.pl"    
    driver.get("http://localhost:5173/signup")
    driver.find_element("css selector", '[data-test-id="username"]').send_keys(user)
    driver.find_element("css selector", '[data-test-id="email"]').send_keys(user)
    driver.find_element("css selector", '[data-test-id="password"]').send_keys("123")
    driver.find_element("css selector", '[data-test-id="password2"]').send_keys("123")
    driver.find_element("css selector", '[data-test-id="register-submit"]').click()
   
    sleep(1)
    assert "/signin" in driver.current_url
    assert not driver.find_element("css selector", '[data-test-id="error"]').is_displayed()
    
    driver.find_element("css selector", '[data-test-id="email"]').send_keys(user)
    driver.find_element("css selector", '[data-test-id="password"]').send_keys("123")
    driver.find_element("css selector", '[data-test-id="login-submit"]').click()
    assert "/" in driver.current_url
    assert not driver.find_element("css selector", '[data-test-id="error"]').is_displayed()
    assert driver.find_element("css selector", '[data-test-id="logout"]').is_displayed()
  

def test_user_exists(driver):
    driver.get("http://localhost:5173/signup")
    driver.find_element("css selector", '[data-test-id="username"]').send_keys("user@user.pl")
    driver.find_element("css selector", '[data-test-id="email"]').send_keys("user@user.pl")
    driver.find_element("css selector", '[data-test-id="password"]').send_keys("wrong")
    driver.find_element("css selector", '[data-test-id="password2"]').send_keys("wrong")
    driver.find_element("css selector", '[data-test-id="register-submit"]').click()

    error = driver.find_element("css selector", '[data-test-id="error"]')
    sleep(2)
    assert error is not None
    assert error.is_displayed()
    assert "/signup" in driver.current_url
    assert error.text == "Username or email already exists"

def test_empty_user(driver):
    driver.get("http://localhost:5173/signup")
    #only username error
    driver.find_element("css selector", '[data-test-id="register-submit"]').click()
    sleep(1)
    username_error = driver.find_element("css selector", '[data-test-id="username-error"]')
    try:
        email_error = driver.find_element("css selector", '[data-test-id="email-error"]')
    except:
        email_error = None
    try:
        password_error = driver.find_element("css selector", '[data-test-id="password-error"]')
    except:
        password_error = None
    try:
        password2_error = driver.find_element("css selector", '[data-test-id="password2-error"]')
    except:
        password2_error = None
    assert "/signup" in driver.current_url
    assert not username_error == None
    assert username_error.is_displayed()
    assert not password_error
    assert not email_error
    assert not password2_error
    assert username_error.text == "Username is required"
    
def test_empty_email(driver):
    driver.get("http://localhost:5173/signup")
    user = f"user-{uuid.uuid4().hex[:8]}@test.pl"    
    driver.find_element("css selector", '[data-test-id="username"]').send_keys(user)
    
    driver.find_element("css selector", '[data-test-id="register-submit"]').click()
    sleep(1)
    error = driver.find_element("css selector", '[data-test-id="email-error"]')
    try:
        username_error = driver.find_element("css selector", '[data-test-id="username-error"]')
    except:
        username_error = None
    try:
        password_error = driver.find_element("css selector", '[data-test-id="password-error"]')
    except:
        password_error = None
    try:
        password2_error = driver.find_element("css selector", '[data-test-id="password2-error"]')
    except:
        password2_error = None
    assert "/signup" in driver.current_url
    assert not username_error
    assert not password_error
    assert not password2_error
    
    assert error.text == "Email is required"
    assert not error == None
    assert error.is_displayed()

def test_empty_password(driver):
    driver.get("http://localhost:5173/signup")
    user = f"user-{uuid.uuid4().hex[:8]}@test.pl"    
    driver.find_element("css selector", '[data-test-id="username"]').send_keys(user)
    driver.find_element("css selector", '[data-test-id="email"]').send_keys(user)
    driver.find_element("css selector", '[data-test-id="register-submit"]').click()
    
    sleep(1)
    
    error = driver.find_element("css selector", '[data-test-id="password-error"]')
    try:
        username_error = driver.find_element("css selector", '[data-test-id="username-error"]')
    except:
        username_error = None
    try:
        email_error = driver.find_element("css selector", '[data-test-id="email-error"]')
    except:
        email_error = None
    try:
        password2_error = driver.find_element("css selector", '[data-test-id="password2-error"]')
    except:
        password2_error = None
    
    assert not username_error
    assert not email_error
    assert not password2_error
    assert "/signup" in driver.current_url
    assert error.text == "Password is required"
    assert not error == None
    assert error.is_displayed()
    
def test_empty_password2(driver):
    driver.get("http://localhost:5173/signup")
    user = f"user-{uuid.uuid4().hex[:8]}@test.pl"    
    driver.find_element("css selector", '[data-test-id="username"]').send_keys(user)
    driver.find_element("css selector", '[data-test-id="email"]').send_keys(user)
    driver.find_element("css selector", '[data-test-id="password"]').send_keys("123")
    driver.find_element("css selector", '[data-test-id="register-submit"]').click()
    
    sleep(1)
    
    error = driver.find_element("css selector", '[data-test-id="password2-error"]')
    try:
        username_error = driver.find_element("css selector", '[data-test-id="username-error"]')
    except:
        username_error = None
    try:
        email_error = driver.find_element("css selector", '[data-test-id="email-error"]')
    except:
        email_error = None
    try:
        password_error = driver.find_element("css selector", '[data-test-id="password-error"]')
    except:
        password_error = None
    
    assert not username_error
    assert not email_error
    assert not password_error
    assert "/signup" in driver.current_url
    assert error.text == "Repeat the password"
    assert not error == None
    assert error.is_displayed()


def test_register_form_invalid_email(driver):
    driver.get("http://localhost:5173/signup")
    #invalid email error
    driver.find_element("css selector", '[data-test-id="username"]').send_keys("user")
    driver.find_element("css selector", '[data-test-id="email"]').send_keys("user")
    driver.find_element("css selector", '[data-test-id="password"]').send_keys("123")
    driver.find_element("css selector", '[data-test-id="password2"]').send_keys("123")
    driver.find_element("css selector", '[data-test-id="register-submit"]').click()
    
    sleep(1)
    
    email_error = driver.find_element("css selector", '[data-test-id="email-error"]')
   
    try:
        username_error = driver.find_element("css selector", '[data-test-id="username-error"]')
    except:
        username_error = None
    try:
        password_error = driver.find_element("css selector", '[data-test-id="password-error"]')
    except:
        password_error = None
    try:
        password2_error = driver.find_element("css selector", '[data-test-id="password2-error"]')
    except:
        password2_error = None
    
    assert not username_error
    assert not password_error
    assert not password2_error
    assert "/signup" in driver.current_url
    assert email_error.text == "Invalid email address"
    assert not email_error == None
    assert email_error.is_displayed()
    

def test_register_form_different_passwords(driver):
    driver.get("http://localhost:5173/signup")
 
    driver.find_element("css selector", '[data-test-id="username"]').send_keys("user")
    driver.find_element("css selector", '[data-test-id="email"]').send_keys("user@u.pl")
    driver.find_element("css selector", '[data-test-id="password"]').send_keys("123")
    driver.find_element("css selector", '[data-test-id="password2"]').send_keys("1234")
    driver.find_element("css selector", '[data-test-id="register-submit"]').click()
    
    sleep(1)
    
    error = driver.find_element("css selector", '[data-test-id="password2-error"]')
   
    try:
        username_error = driver.find_element("css selector", '[data-test-id="username-error"]')
    except:
        username_error = None
    try:
        password_error = driver.find_element("css selector", '[data-test-id="password-error"]')
    except:
        password_error = None
    try:
        email_error = driver.find_element("css selector", '[data-test-id="email-error"]')
    except:
        email_error = None
    
    assert not username_error
    assert not password_error
    assert not email_error
    assert "/signup" in driver.current_url
    assert error.text == "Passwords are not the same"
    assert not error == None
    assert error.is_displayed()