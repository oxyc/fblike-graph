# Usage:
#     make url=http://local.com browsers
#     make url=http://local.com ie7
BROWSER_CMD=google-chrome
URL=$(url)/test/index.html

all:

browsers: ie7 ie8 ie9 opera10 ff3.6 ff4 ff16 chrome14 ios3 ios3.2 ios4 ios4.3.2 ios5 ios5.1 ios6

launch_browser:
	$(BROWSER_CMD) "http://www.browserstack.com/start#os=$(OS)&os_version=$(OS_VERSION)&browser=$(BROWSER)&browser_version=$(BROWSER_VERSION)&zoom_to_fit=true&resolution=1024x768&speed=1&url=$(URL)&start=true"

launch_device:
	$(BROWSER_CMD) "http://www.browserstack.com/start#os=$(OS)&os_version=$(OS_VERSION)&device=$(DEVICE)&zoom_to_fit=true&resolution=1024x768&speed=1&url=$(URL)&start=true"

ie7:
	@$(MAKE) -s OS=Windows OS_VERSION=XP BROWSER=IE BROWSER_VERSION=7.0 launch_browser

ie8:
	@$(MAKE) -s OS=Windows OS_VERSION=XP BROWSER=IE BROWSER_VERSION=8.0 launch_browser

ie9:
	@$(MAKE) -s OS=Windows OS_VERSION=7 BROWSER=IE BROWSER_VERSION=9.0 launch_browser

opera10:
	@$(MAKE) -s OS=Windows OS_VERSION=7 BROWSER=Opera BROWSER_VERSION=10.0 launch_browser

ff3.6:
	@$(MAKE) -s OS=Windows OS_VERSION=XP BROWSER=Firefox BROWSER_VERSION=3.6 launch_browser

ff4:
	@$(MAKE) -s OS=Windows OS_VERSION=XP BROWSER=Firefox BROWSER_VERSION=4 launch_browser

ff16:
	@$(MAKE) -s OS=Windows OS_VERSION=XP BROWSER=Firefox BROWSER_VERSION=16 launch_browser

chrome14:
	@$(MAKE) -s OS=Windows OS_VERSION=XP BROWSER=Chrome BROWSER_VERSION=14 launch_browser

chrome23:
	@$(MAKE) -s OS=Windows OS_VERSION=XP BROWSER=Chrome BROWSER_VERSION=23 launch_browser

ios3:
	@$(MAKE) -s OS=ios OS_VERSION=3.0 DEVICE=Iphone+3GS launch_device

ios3.2:
	@$(MAKE) -s OS=ios OS_VERSION=3.2 DEVICE=iPad launch_device

ios4:
	@$(MAKE) -s OS=ios OS_VERSION=4.0 DEVICE=Iphone+4 launch_device

ios4.3.2:
	@$(MAKE) -s OS=ios OS_VERSION=4.3.2 DEVICE=iPad launch_device

ios5:
	@$(MAKE) -s OS=ios OS_VERSION=5.0 DEVICE=iPad launch_device

ios5.1:
	@$(MAKE) -s OS=ios OS_VERSION=5.1 DEVICE=Iphone+4S launch_device

ios6:
	@$(MAKE) -s OS=ios OS_VERSION=6.0 DEVICE=Iphone+4S launch_device
