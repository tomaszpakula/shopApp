import pytest
import os
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from webdriver_manager.chrome import ChromeDriverManager
from dotenv import load_dotenv
from selenium.webdriver.common.desired_capabilities import DesiredCapabilities
from selenium.webdriver.remote.webdriver import WebDriver as RemoteWebDriver
from selenium.webdriver.chrome.options import Options as ChromeOptions

load_dotenv()

def pytest_addoption(parser):
    parser.addoption(
        "--env", action="store", default="local", help="Environment to run tests against: local or browserstack"
    )

@pytest.fixture
def driver(request):
    env = request.config.getoption("--env")

    if env == "browserstack":
        username = os.getenv("BROWSERSTACK_USERNAME")
        access_key = os.getenv("BROWSERSTACK_ACCESS_KEY")

        options = ChromeOptions()
        options.set_capability("browserName", "Chrome")
        options.set_capability("browser_version", "latest")
        options.set_capability("os", "Windows")
        options.set_capability("os_version", "10")
        options.set_capability("name", "Pytest BrowserStack Test")
        options.set_capability("build", "Pytest Build")
        options.set_capability("browserstack.debug", "true")

        driver = webdriver.Remote(
            command_executor=f"https://{username}:{access_key}@hub-cloud.browserstack.com/wd/hub",
            options=options
        )
        driver.implicitly_wait(10)
        yield driver
        driver.quit()

    else:
        options = Options()
        service = Service(ChromeDriverManager().install())
        driver = webdriver.Chrome(service=service, options=options)
        driver.implicitly_wait(2)
        yield driver
        driver.quit()
