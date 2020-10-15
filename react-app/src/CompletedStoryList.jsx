import React from 'react'

export default class CompletedStoryList extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            demoStories: []
        };
    }

    componentDidMount() {
        let that = this;
        fetch("/getallcompleted").then(function (response) {
            return response.json()
        })
            .then(function (json) {
                json.stories.forEach((ele) => {
                    console.log(ele)
                    console.log(ele.votes)
                    ele.votes = that.getVotes(ele.votes)
                    console.log(ele.votes)
                });
                json.stories.sort((a, b) => b.votes - a.votes);
                that.setState({
                    demoStories: json.stories
                });
            })
        // that.setState({
        //     demoStories : [{votes: 1, _id: 1, title: 'demoTitle'}]
        // });
    }

    render() {
        return (<div>
            {this.state.demoStories.map((story) => {
                return (<div onClick={() => this.click(story._id)}>
                    <div style={{
                        marginLeft: '10px',
                        fontSize: '20px',
                        display: 'flex',
                        width: 'fit-content',
                        cursor: 'pointer'
                    }}>
                        <b style={{marginRight: '5px'}}>{`${story.votes}:`}</b>
                        <div style={{color: 'blue'}}>{story.title}</div>
                    </div>
                    <p>{'\t' + this.getFirstWords(story.listofwords)}</p>
                </div>)
            })}
        </div>)
    }

    //assumes that vote objects in the votes array have a value field
    getVotes(votes) {
        let voteCount = 0;
        for (const vote in votes) {
            voteCount += votes[vote].value;
        }
        return voteCount;
    }

    getFirstWords(listOfWords) {
        let firstX = "";
        listOfWords.forEach((ele, index) => {
            if (index < 3) {
                firstX += `${ele} `;
            } else if (index === 3) {
                firstX += '...'
            }
        })
        return firstX
    }


    click(id) {
        this.props.setCurrentStory(id);
        setTimeout(() => window.open('/completeStory?id=' + id, "_self"), 10);
    }


}
