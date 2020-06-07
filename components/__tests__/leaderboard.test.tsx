import 'jsdom-global/register'; 
import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { shallow, configure, mount } from 'enzyme';
import Leaderboard from '../leaderboard';

configure({adapter: new Adapter()});
describe('Leaderboard', () => {
  it('renders correctly', () => {
    const leaderboard = [];
    const wrapper = shallow(<Leaderboard leaderboard={leaderboard} />);
    expect(wrapper).toMatchSnapshot();
  });

  it('sorts correctly', () => {
    const unsortedLeaderboard = [
      {"name": "domdolla", "score": 5},
      {"name": "mk", "score": 3},
      {"name": "sonnyfodera", "score": 8},
      {"name": "dombresky", "score": 4}
    ];

    const wrapper = mount(<Leaderboard leaderboard={unsortedLeaderboard} />);
    const leaderboardElement = wrapper.find('ul#leaderboard');
    expect(leaderboardElement.children()).toHaveLength(unsortedLeaderboard.length);
    
    const sortedLeaderboard = unsortedLeaderboard.sort((a,b) => {return a.score < b.score ? 1 : -1});

    leaderboardElement.children().forEach((child, index) => {
      const name = child.find('span').at(0).text(); //may change if dom implementation changes
      const score = child.find('span').at(1).text(); //may change if dom implementation changes
      expect(name).toEqual(sortedLeaderboard[index].name.toString());
      expect(score).toEqual(sortedLeaderboard[index].score.toString());
    });
  });
});
