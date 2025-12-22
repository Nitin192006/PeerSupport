const ListenerProfile = require('../models/ListenerProfile');
const User = require('../models/User');

// @desc    Get all listeners (Filtered & Sorted)
// @route   GET /api/listeners
// @access  Private
const getListeners = async (req, res) => {
    try {
        const { tag } = req.query;

        let query = {
            isOnline: true,
            isBusy: false
        };

        if (tag) {
            query.tags = tag;
        }

        // UPDATED: Populate 'equippedFrame' so frontend can display it
        let listeners = await ListenerProfile.find(query)
            .populate('user', 'username avatar equippedFrame')
            .lean();

        // Bayesian Scoring
        const m = 5;
        const C = 4.0;

        listeners = listeners.map(listener => {
            const v = listener.rating.count;
            const R = listener.rating.average;
            const weightedScore = (v / (v + m)) * R + (m / (v + m)) * C;
            return { ...listener, qualityScore: weightedScore };
        });

        listeners.sort((a, b) => b.qualityScore - a.qualityScore);

        res.json(listeners);

    } catch (error) {
        res.status(500);
        throw new Error('Server Error: Could not fetch listeners');
    }
};

// @desc    Update OR Create Listener Profile (Onboarding)
// @route   PUT /api/listeners/profile
// @access  Private
const updateProfile = async (req, res) => {
    try {
        const { tags } = req.body;
        const userId = req.user.id;

        const profile = await ListenerProfile.findOneAndUpdate(
            { user: userId },
            {
                $set: { tags: tags },
                $setOnInsert: {
                    user: userId,
                    isOnline: false,
                    isBusy: false,
                    rating: { average: 0, count: 0, bayesianScore: 0 },
                    stats: { totalListenTime: 0, chatsCompleted: 0, ghostingIncidents: 0 }
                }
            },
            { new: true, upsert: true, setDefaultsOnInsert: true }
        );

        await User.findByIdAndUpdate(userId, {
            'roles.isListener': true,
            listenerProfileId: profile._id
        });

        res.json(profile);

    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
};

// @desc    Toggle Online/Offline Status
// @route   PUT /api/listeners/status
// @access  Private
const toggleStatus = async (req, res) => {
    try {
        const userId = req.user.id;
        const profile = await ListenerProfile.findOne({ user: userId });

        if (!profile) {
            res.status(404);
            throw new Error('Please set up your listener profile first.');
        }

        profile.isOnline = !profile.isOnline;
        await profile.save();

        res.json({ isOnline: profile.isOnline });

    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
};

module.exports = { getListeners, updateProfile, toggleStatus };