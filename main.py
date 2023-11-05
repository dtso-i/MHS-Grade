import kivy
from kivy.app import App
from kivy.uix.button import Button
from kivy.uix.label import Label
from kivy.uix.screenmanager import ScreenManager, Screen, NoTransition
from functools import partial
import webbrowser

sm = ScreenManager(transition=NoTransition())

def signinF():
  webbrowser.open('https://maranathahighschool.myschoolapp.com/app/student#studentmyday/progress')
  sm.current = 'home'

def fetchGrade():
  pass

class signinScreen(Screen):
  def __init__(self,**kw):
    super(signinScreen, self).__init__(**kw)
    signinButton = Button(
      text='sign in here',
      size_hint=(None, None),
      size=(165,120),
      pos_hint={'center_x':.5,'center_y':.5})
    signinButton.bind(on_press=partial(signinF))
    reminder = Label(
      text='do NOT close the tab after signed in',
      pos_hint={'center_x':.5,'center_y':.6})
    self.add_widget(reminder)
    self.add_widget(signinButton)
    
class homeScreen(Screen):
  fetchGrade()
    
class title(App):
  def build(self):
    sm.add_widget(signinScreen(name='signin'))
    sm.add_widget(homeScreen(name='home'))
    return sm
    
if __name__ == '__main__':
  title().run()